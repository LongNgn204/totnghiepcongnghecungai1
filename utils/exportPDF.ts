import { jsPDF } from 'jspdf';
import type { ExamHistory } from './examStorage';

// Load Vietnamese font (workaround for Unicode support)
const addVietnameseFont = (doc: jsPDF) => {
  // Note: jsPDF doesn't support Vietnamese natively
  // This is a simplified version using basic Latin characters
  // For production, you'd need to embed a custom font
};

export const exportExamToPDF = (exam: ExamHistory) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper: Add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper: Wrap text
  const wrapText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth);
  };

  // Header
  doc.setFillColor(59, 130, 246); // Blue gradient
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('KET QUA BAI THI', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(exam.examTitle, pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(10);
  const examDate = new Date(exam.createdAt).toLocaleDateString('vi-VN');
  doc.text(`Ngay thi: ${examDate} | Thoi gian: ${exam.timeSpent} phut`, pageWidth / 2, 32, { align: 'center' });

  yPos = 50;

  // Score Summary
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, 'F');
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TONG KET', margin + 5, yPos + 8);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tong cau: ${exam.totalQuestions}`, margin + 5, yPos + 15);
  doc.text(`Dung: ${exam.score}`, margin + 50, yPos + 15);
  doc.text(`Sai: ${exam.totalQuestions - exam.score}`, margin + 90, yPos + 15);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const scoreColor = exam.percentage >= 80 ? [34, 197, 94] : exam.percentage >= 50 ? [234, 179, 8] : [239, 68, 68];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(`${exam.percentage.toFixed(1)}%`, pageWidth - margin - 20, yPos + 15);

  yPos += 35;

  // Questions Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  // Part I: Multiple Choice
  checkPageBreak(20);
  doc.setFillColor(59, 130, 246);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text('PHAN I: TRAC NGHIEM (CAU 1-20)', margin + 3, yPos + 6);
  yPos += 12;

  const mcQuestions = exam.questions.filter(q => q.type === 'multiple-choice');
  mcQuestions.forEach((question, idx) => {
    checkPageBreak(35);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    
    // Question number and status
    const isCorrect = question.userAnswer === question.correctAnswer;
    const statusIcon = isCorrect ? '[DUNG]' : '[SAI]';
    doc.setTextColor(isCorrect ? 34 : 239, isCorrect ? 197 : 68, isCorrect ? 94 : 68);
    doc.text(`${statusIcon}`, margin, yPos);
    
    doc.setTextColor(0, 0, 0);
    const questionLines = wrapText(`Cau ${idx + 1}: ${question.question}`, contentWidth - 20);
    doc.text(questionLines, margin + 15, yPos);
    yPos += questionLines.length * 5;

    // Options
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const options = ['A', 'B', 'C', 'D'];
    options.forEach((opt, optIdx) => {
      const optionText = question.options[optIdx];
      const isUserAnswer = question.userAnswer === opt;
      const isCorrectAnswer = question.correctAnswer === opt;
      
      if (isCorrectAnswer) {
        doc.setTextColor(34, 197, 94);
        doc.setFont('helvetica', 'bold');
      } else if (isUserAnswer && !isCorrectAnswer) {
        doc.setTextColor(239, 68, 68);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
      }
      
      const optionLines = wrapText(`${opt}. ${optionText}`, contentWidth - 25);
      doc.text(optionLines, margin + 20, yPos);
      yPos += optionLines.length * 5;
    });

    // Explanation
    if (question.explanation) {
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      const explLines = wrapText(`=> ${question.explanation}`, contentWidth - 25);
      doc.text(explLines, margin + 20, yPos);
      yPos += explLines.length * 4 + 2;
    }

    yPos += 5; // Space between questions
  });

  // Part II: True/False
  checkPageBreak(20);
  doc.setFillColor(34, 197, 94);
  doc.rect(margin, yPos, contentWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PHAN II: TRAC NGHIEM DUNG/SAI (CAU 21-24)', margin + 3, yPos + 6);
  yPos += 12;

  const tfQuestions = exam.questions.filter(q => q.type === 'true-false');
  tfQuestions.forEach((question, idx) => {
    checkPageBreak(50);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Cau ${mcQuestions.length + idx + 1}: ${question.question}`, margin, yPos);
    yPos += 7;

    // Statements
    if (question.statements && question.answers && question.explanations) {
      ['a', 'b', 'c', 'd'].forEach((key) => {
        const statement = question.statements![key as keyof typeof question.statements];
        const correctAnswer = question.answers![key as keyof typeof question.answers];
        const explanation = question.explanations![key as keyof typeof question.explanations];
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        const stmtLines = wrapText(`${key}. ${statement}`, contentWidth - 25);
        doc.text(stmtLines, margin + 15, yPos);
        yPos += stmtLines.length * 5;

        // Answer
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(correctAnswer ? 34 : 239, correctAnswer ? 197 : 68, correctAnswer ? 94 : 68);
        doc.text(`Dap an: ${correctAnswer ? 'DUNG' : 'SAI'}`, margin + 20, yPos);
        yPos += 5;

        // Explanation
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'italic');
        const explLines = wrapText(`${explanation}`, contentWidth - 30);
        doc.text(explLines, margin + 20, yPos);
        yPos += explLines.length * 4 + 3;
      });
    }

    yPos += 5;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Trang ${i}/${totalPages} - Tao boi AI Ho tro Hoc tap Cong nghe`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Save
  const fileName = `${exam.examTitle.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
  doc.save(fileName);
};
