import express from 'express';
import cors from 'cors';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const app = express();
const PORT = process.env.PORT || 5000;

// Helper function to remove emojis and special characters that can't be encoded
function cleanTextForPDF(text) {
  // Remove emojis and special Unicode characters
  return text.replace(/[\u{1F000}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
             .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Generate PDF from diet plan text
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { dietPlan, userInfo } = req.body;

    if (!dietPlan) {
      return res.status(400).json({ error: 'Diet plan text is required' });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed fonts
    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const monoFont = await pdfDoc.embedFont(StandardFonts.Courier);

    // Add first page
    let page = pdfDoc.addPage([612, 792]); // Letter size (8.5" x 11")
    const { width, height } = page.getSize();
    
    let yPosition = height - 60;

    // Header - Title (emoji removed for PDF compatibility)
    page.drawText('AI Diet Planner', {
      x: 50,
      y: yPosition,
      size: 28,
      font: titleFont,
      color: rgb(0.3, 0.84, 0.96), // Primary cyan color
    });
    
    yPosition -= 30;
    
    page.drawText('Your Personalized Wellness Journey', {
      x: 50,
      y: yPosition,
      size: 14,
      font: bodyFont,
      color: rgb(0.68, 0.72, 0.83),
    });

    yPosition -= 20;
    
    // Draw separator line
    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1,
      color: rgb(0.3, 0.84, 0.96),
      opacity: 0.3,
    });

    yPosition -= 30;

    // User Information Section
    if (userInfo) {
      page.drawText('User Information:', {
        x: 50,
        y: yPosition,
        size: 12,
        font: titleFont,
        color: rgb(0.85, 0.88, 0.99),
      });
      
      yPosition -= 20;
      
      const userDetails = [
        `Age: ${userInfo.age || 'N/A'}`,
        `Gender: ${userInfo.gender || 'N/A'}`,
        `Activity Level: ${userInfo.activityLevel || 'N/A'}`,
        `Weight: ${userInfo.weight || 'N/A'} kg`,
        `Goal: ${userInfo.goal || 'N/A'}`,
      ];

      userDetails.forEach((detail) => {
        page.drawText(detail, {
          x: 70,
          y: yPosition,
          size: 10,
          font: bodyFont,
          color: rgb(0.68, 0.72, 0.83),
        });
        yPosition -= 15;
      });
      
      yPosition -= 20;
    }

    // Diet Plan Content
    page.drawText('Your Diet Plan:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: titleFont,
      color: rgb(0.85, 0.88, 0.99),
    });
    
    yPosition -= 25;

    // Parse and format diet plan text
    const lines = dietPlan.split('\n');
    const maxWidth = width - 100;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if we need a new page
      if (yPosition < 60) {
        page = pdfDoc.addPage([612, 792]);
        yPosition = height - 60;
      }
      
      if (!line) {
        yPosition -= 10;
        continue;
      }
      
      // Section headers (all caps or starts with specific keywords)
      if (line.toUpperCase() === line && line.length < 50) {
        yPosition -= 5;
        page.drawText(cleanTextForPDF(line), {
          x: 50,
          y: yPosition,
          size: 11,
          font: titleFont,
          color: rgb(0.3, 0.84, 0.96),
        });
        yPosition -= 20;
      }
      // Bullet points
      else if (line.startsWith('-')) {
        const text = cleanTextForPDF(line.substring(1).trim());
        
        // Word wrap for long lines
        const words = text.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = bodyFont.widthOfTextAtSize(testLine, 10);
          
          if (textWidth > maxWidth - 70) {
            page.drawText('• ' + currentLine, {
              x: 70,
              y: yPosition,
              size: 10,
              font: bodyFont,
              color: rgb(0.68, 0.72, 0.83),
            });
            yPosition -= 15;
            currentLine = word;
            
            if (yPosition < 60) {
              page = pdfDoc.addPage([612, 792]);
              yPosition = height - 60;
            }
          } else {
            currentLine = testLine;
          }
        }
        
        if (currentLine) {
          page.drawText('• ' + currentLine, {
            x: 70,
            y: yPosition,
            size: 10,
            font: bodyFont,
            color: rgb(0.68, 0.72, 0.83),
          });
          yPosition -= 15;
        }
      }
      // Regular text
      else {
        // Word wrap for regular text
        const words = cleanTextForPDF(line).split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = bodyFont.widthOfTextAtSize(testLine, 10);
          
          if (textWidth > maxWidth) {
            page.drawText(currentLine, {
              x: 60,
              y: yPosition,
              size: 10,
              font: bodyFont,
              color: rgb(0.85, 0.88, 0.99),
            });
            yPosition -= 15;
            currentLine = word;
            
            if (yPosition < 60) {
              page = pdfDoc.addPage([612, 792]);
              yPosition = height - 60;
            }
          } else {
            currentLine = testLine;
          }
        }
        
        if (currentLine) {
          page.drawText(currentLine, {
            x: 60,
            y: yPosition,
            size: 10,
            font: bodyFont,
            color: rgb(0.85, 0.88, 0.99),
          });
          yPosition -= 15;
        }
      }
    }

    // Add footer on last page
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const lastPageHeight = lastPage.getSize().height;
    
    lastPage.drawText('Generated by AI Diet Planner - Your Wellness Partner', {
      x: 50,
      y: 30,
      size: 8,
      font: bodyFont,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    lastPage.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
      x: width - 200,
      y: 30,
      size: 8,
      font: bodyFont,
      color: rgb(0.5, 0.5, 0.5),
    });

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=diet-plan.pdf');
    res.setHeader('Content-Length', pdfBytes.length);

    // Send PDF
    res.send(Buffer.from(pdfBytes));

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message 
    });
  }
});


// Save diet plan to history (in-memory for now, can be connected to a database)
let dietHistory = [];

app.post('/api/save-plan', (req, res) => {
  try {
    const { dietPlan, userInfo, parsedData } = req.body;

    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      userInfo,
      dietPlan,
      parsedData,
    };

    dietHistory.push(historyItem);

    // Keep only last 50 plans in memory
    if (dietHistory.length > 50) {
      dietHistory = dietHistory.slice(-50);
    }

    res.json({ 
      success: true, 
      message: 'Diet plan saved successfully',
      id: historyItem.id
    });
  } catch (error) {
    console.error('Error saving plan:', error);
    res.status(500).json({ 
      error: 'Failed to save diet plan', 
      details: error.message 
    });
  }
});

// Get diet plan history
app.get('/api/history', (req, res) => {
  try {
    const history = dietHistory.map(item => ({
      id: item.id,
      timestamp: item.timestamp,
      userInfo: item.userInfo,
      bmi: item.parsedData?.bmi,
      calories: item.parsedData?.calories,
    }));

    res.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch history', 
      details: error.message 
    });
  }
});

// Get specific diet plan by ID
app.get('/api/history/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const plan = dietHistory.find(item => item.id === id);

    if (!plan) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }

    res.json({ success: true, plan });
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ 
      error: 'Failed to fetch diet plan', 
      details: error.message 
    });
  }
});

// Delete diet plan
app.delete('/api/history/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = dietHistory.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }

    dietHistory.splice(index, 1);
    res.json({ success: true, message: 'Diet plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ 
      error: 'Failed to delete diet plan', 
      details: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📄 PDF Generation endpoint: http://localhost:${PORT}/api/generate-pdf`);
  console.log(`💾 Save plan endpoint: http://localhost:${PORT}/api/save-plan`);
  console.log(`📋 History endpoint: http://localhost:${PORT}/api/history`);
});
