const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const QRCode = require('qrcode');

class CertificateGenerator {
  constructor() {
    this.certificatesDir = path.join(__dirname, '../certificates');
    if (!fs.existsSync(this.certificatesDir)) {
      fs.mkdirSync(this.certificatesDir, { recursive: true });
    }
  }

  generateCertificateHash(data) {
    const content = JSON.stringify({
      learnerName: data.learner_name,
      courseName: data.course_name,
      instituteName: data.institute_name,
      issueDate: data.issue_date
    });
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  async generateQRCode(certificateId) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${certificateId}`;
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  async generatePDF(certificateData, certificateId) {
    return new Promise(async (resolve, reject) => {
      try {
        const filename = `certificate_${certificateId}.pdf`;
        const filepath = path.join(this.certificatesDir, filename);
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
        
        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Background
        doc.rect(0, 0, doc.page.width, doc.page.height)
           .fill('#f8f9fa');

        // Border
        doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
           .lineWidth(3)
           .stroke('#2c3e50');

        doc.rect(35, 35, doc.page.width - 70, doc.page.height - 70)
           .lineWidth(1)
           .stroke('#3498db');

        // Header
        doc.fontSize(40)
           .fillColor('#2c3e50')
           .font('Helvetica-Bold')
           .text('CERTIFICATE OF COMPLETION', 60, 100, {
             align: 'center',
             width: doc.page.width - 120
           });

        // Decorative line
        doc.moveTo(200, 160)
           .lineTo(doc.page.width - 200, 160)
           .lineWidth(2)
           .stroke('#3498db');

        // Content
        doc.fontSize(16)
           .fillColor('#555')
           .font('Helvetica')
           .text('This is to certify that', 60, 200, {
             align: 'center',
             width: doc.page.width - 120
           });

        doc.fontSize(32)
           .fillColor('#2c3e50')
           .font('Helvetica-Bold')
           .text(certificateData.learner_name, 60, 240, {
             align: 'center',
             width: doc.page.width - 120
           });

        doc.fontSize(16)
           .fillColor('#555')
           .font('Helvetica')
           .text('has successfully completed', 60, 300, {
             align: 'center',
             width: doc.page.width - 120
           });

        doc.fontSize(24)
           .fillColor('#3498db')
           .font('Helvetica-Bold')
           .text(certificateData.course_name, 60, 340, {
             align: 'center',
             width: doc.page.width - 120
           });

        // Institute info
        doc.fontSize(14)
           .fillColor('#555')
           .font('Helvetica')
           .text(`Issued by: ${certificateData.institute_name}`, 60, 400, {
             align: 'center',
             width: doc.page.width - 120
           });

        doc.fontSize(12)
           .fillColor('#777')
           .text(`Date: ${new Date(certificateData.issue_date).toLocaleDateString('en-US', { 
             year: 'numeric', 
             month: 'long', 
             day: 'numeric' 
           })}`, 60, 430, {
             align: 'center',
             width: doc.page.width - 120
           });

        // QR Code
        const qrCodeDataUrl = await this.generateQRCode(certificateId);
        const qrImageBuffer = Buffer.from(qrCodeDataUrl.split(',')[1], 'base64');
        
        doc.image(qrImageBuffer, doc.page.width - 160, doc.page.height - 160, {
          width: 100,
          height: 100
        });

        doc.fontSize(9)
           .fillColor('#999')
           .text('Scan to verify', doc.page.width - 160, doc.page.height - 50, {
             width: 100,
             align: 'center'
           });

        // Certificate ID
        doc.fontSize(8)
           .fillColor('#aaa')
           .text(`Certificate ID: ${certificateId}`, 60, doc.page.height - 60, {
             align: 'left'
           });

        // Blockchain info
        doc.fontSize(8)
           .fillColor('#27ae60')
           .text('✓ Verified on Blockchain', 60, doc.page.height - 45, {
             align: 'left'
           });

        doc.end();

        stream.on('finish', () => {
          resolve({
            filename,
            filepath,
            qrCode: qrCodeDataUrl
          });
        });

        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new CertificateGenerator();
