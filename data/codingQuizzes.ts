import { QuestionMC, QuestionTF } from '../types';

export interface LessonQuiz {
  mc: QuestionMC[];
  tf: QuestionTF[];
}

export const codingQuizzes: Record<string, LessonQuiz> = {
  // PYTHON
  'py-01': {
    mc: [
      { id: 10101, type: 'multiple_choice', question: 'Hàm in ra màn hình?', options: ['echo()', 'print()', 'console.log()', 'printf()'], answer: 'print()' },
      { id: 10102, type: 'multiple_choice', question: 'Chuỗi đặt trong?', options: ['[]', "'' hoặc \"\"", '{}', '()'], answer: "'' hoặc \"\"" }
    ],
    tf: [
      { id: 10103, type: 'true_false', question: 'Căn bản Python', statements: [
        { id: 's1', text: 'Python phân biệt hoa/thường', isCorrect: true },
        { id: 's2', text: 'Phải có ; cuối dòng', isCorrect: false }
      ] }
    ]
  },
  'py-02': {
    mc: [
      { id: 10201, type: 'multiple_choice', question: 'Kiểu của 1.75 là?', options: ['int', 'float', 'str', 'bool'], answer: 'float' },
      { id: 10202, type: 'multiple_choice', question: 'f-string đúng dạng?', options: ['f(name={})', 'f"Tên: {name}"', 'format(name)', 'printf(name)'], answer: 'f"Tên: {name}"' }
    ],
    tf: [
      { id: 10203, type: 'true_false', question: 'Biến & kiểu', statements: [
        { id: 's1', text: '"15" là int', isCorrect: false },
        { id: 's2', text: 'True là bool', isCorrect: true }
      ] }
    ]
  },
  'py-03': {
    mc: [
      { id: 10301, type: 'multiple_choice', question: 'Hàm tính tổng list?', options: ['total()', 'add()', 'sum()', 'reduce()'], answer: 'sum()' }
    ],
    tf: []
  },
  'py-04': {
    mc: [
      { id: 10401, type: 'multiple_choice', question: 'Hàm phải ... kết quả', options: ['print', 'return', 'export', 'yield'], answer: 'return' }
    ],
    tf: []
  },
  'py-05': {
    mc: [
      { id: 10501, type: 'multiple_choice', question: 'Điều kiện chẵn?', options: ['n%2==1', 'n%2==0', 'n/2==0', 'n==2'], answer: 'n%2==0' }
    ],
    tf: []
  },
  'py-06': {
    mc: [
      { id: 10601, type: 'multiple_choice', question: 'Hàm bỏ khoảng trắng 2 đầu?', options: ['trim()', 'strip()', 'clean()', 'remove()'], answer: 'strip()' }
    ],
    tf: []
  },
  'py-07': {
    mc: [ { id: 10701, type: 'multiple_choice', question: 'range để cộng 1..n?', options: ['range(n)', 'range(1,n+1)', 'range(0,n)', 'range(2,n)'], answer: 'range(1,n+1)' } ],
    tf: []
  },
  'py-08': { mc: [ { id: 10801, type: 'multiple_choice', question: '5! bằng?', options: ['60', '100', '120', '24'], answer: '120' } ], tf: [] },
  'py-09': { mc: [ { id: 10901, type: 'multiple_choice', question: 'Điều kiện số chẵn?', options: ['x%2==1', 'x%2==0', 'x==0', 'x>0'], answer: 'x%2==0' } ], tf: [] },
  'py-10': { mc: [ { id: 11001, type: 'multiple_choice', question: 'Tách từ trong chuỗi?', options: ['split()', 'slice()', 'divide()', 'separate()'], answer: 'split()' } ], tf: [] },

  // ARDUINO
  'ard-01': {
    mc: [ { id: 20101, type: 'multiple_choice', question: 'LED tích hợp nối với chân?', options: ['2', '8', '10', '13'], answer: '13' } ],
    tf: [ { id: 20102, type: 'true_false', question: 'LED cơ bản', statements: [ { id: 's1', text: 'HIGH là bật', isCorrect: true }, { id: 's2', text: 'LOW là bật', isCorrect: false } ] } ]
  },
  'ard-02': {
    mc: [ { id: 20201, type: 'multiple_choice', question: 'Thứ tự đúng của đèn?', options: ['Đỏ->Xanh->Vàng', 'Đỏ->Vàng->Xanh', 'Xanh->Đỏ->Vàng', 'Vàng->Đỏ->Xanh'], answer: 'Đỏ->Vàng->Xanh' } ], tf: []
  },
  'ard-03': {
    mc: [ { id: 20301, type: 'multiple_choice', question: 'Hàm đọc trạng thái chân số?', options: ['readPin()', 'pinRead()', 'digitalRead()', 'analogRead()'], answer: 'digitalRead()' } ], tf: []
  },
  'ard-04': { mc: [ { id: 20401, type: 'multiple_choice', question: 'SOS gồm ... ký hiệu?', options: ['.. . ..', '... --- ...', '.- -.- .-.', '--- ... ---'], answer: '... --- ...' } ], tf: [] },
  'ard-05': { mc: [ { id: 20501, type: 'multiple_choice', question: 'Số LED chạy trong Knight Rider (mẫu)?', options: ['2', '3', '4', '5'], answer: '4' } ], tf: [] }
};

export default codingQuizzes;

