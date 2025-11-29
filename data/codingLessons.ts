// Coding Lessons Data - Mock Data for Python & Arduino
export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'python' | 'arduino';
  starterCode: string;
  expectedOutput?: string;
  hints: string[];
  objectives: string[];
  completed: boolean;
  category: string;
}

export const codingLessons: Lesson[] = [
  // ==================== PYTHON LESSONS ====================
  {
    id: 'py-01',
    title: 'Hello World',
    description: 'Bài học đầu tiên - In ra "Hello World" để làm quen với Python',
    difficulty: 'easy',
    language: 'python',
    category: 'Cơ Bản',
    starterCode: `# Bài 1: In ra Hello World
# TODO: Viết code để in ra "Hello World"

`,
    expectedOutput: 'Hello World',
    hints: [
      'Sử dụng hàm print() để in ra dữ liệu',
      'Cú pháp: print("text")',
      'Đừng quên dấu ngoặc kép'
    ],
    objectives: [
      'Hiểu cách sử dụng hàm print()',
      'Làm quen với cú pháp Python cơ bản',
      'Chạy code lần đầu tiên'
    ],
    completed: false
  },
  {
    id: 'py-02',
    title: 'Biến và Kiểu Dữ Liệu',
    description: 'Học cách khai báo biến và làm việc với các kiểu dữ liệu cơ bản',
    difficulty: 'easy',
    language: 'python',
    category: 'Cơ Bản',
    starterCode: `# Bài 2: Biến và Kiểu Dữ Liệu
# Khai báo các biến
name = "Học sinh"
age = 15
height = 1.75

# TODO: In ra thông tin học sinh
# Gợi ý: Sử dụng print() và f-string

`,
    expectedOutput: 'Học sinh\n15\n1.75',
    hints: [
      'Dùng print() để in từng biến',
      'Hoặc dùng f-string: print(f"Tên: {name}")',
      'Kiểu dữ liệu: str, int, float'
    ],
    objectives: [
      'Khai báo và sử dụng biến',
      'Hiểu các kiểu dữ liệu cơ bản',
      'In ra giá trị biến'
    ],
    completed: false
  },
  {
    id: 'py-03',
    title: 'Tính Tổng Danh Sách',
    description: 'Viết chương trình tính tổng các số trong một danh sách',
    difficulty: 'medium',
    language: 'python',
    category: 'Danh Sách & Vòng Lặp',
    starterCode: `# Bài 3: Tính Tổng Danh Sách
numbers = [10, 20, 30, 40, 50]

# TODO: Tính tổng các số trong danh sách
# Cách 1: Dùng vòng lặp for
# Cách 2: Dùng hàm sum()

total = 0
# Viết code của bạn ở đây

print(f"Tổng: {total}")
`,
    expectedOutput: 'Tổng: 150',
    hints: [
      'Dùng vòng lặp for để duyệt qua từng phần tử',
      'Cộng dồn từng phần tử vào biến total',
      'Hoặc dùng hàm sum() trực tiếp: total = sum(numbers)'
    ],
    objectives: [
      'Làm việc với danh sách (list)',
      'Sử dụng vòng lặp for',
      'Tính toán trên dữ liệu'
    ],
    completed: false
  },
  {
    id: 'py-04',
    title: 'Hàm và Tham Số',
    description: 'Tạo hàm để tính diện tích hình chữ nhật',
    difficulty: 'medium',
    language: 'python',
    category: 'Hàm',
    starterCode: `# Bài 4: Hàm và Tham Số
# TODO: Viết hàm tính diện tích hình chữ nhật
# Hàm nhận 2 tham số: chiều dài và chiều rộng

def calculate_area(length, width):
    # Viết code của bạn ở đây
    pass

# Gọi hàm
area = calculate_area(5, 3)
print(f"Diện tích: {area}")
`,
    expectedOutput: 'Diện tích: 15',
    hints: [
      'Diện tích = chiều dài × chiều rộng',
      'Hàm phải return kết quả',
      'Cú pháp: def function_name(param1, param2):'
    ],
    objectives: [
      'Định nghĩa hàm',
      'Sử dụng tham số',
      'Return giá trị từ hàm'
    ],
    completed: false
  },
  {
    id: 'py-05',
    title: 'Điều Kiện If-Else',
    description: 'Viết chương trình kiểm tra xem một số có phải số chẵn không',
    difficulty: 'medium',
    language: 'python',
    category: 'Điều Kiện',
    starterCode: `# Bài 5: Điều Kiện If-Else
number = 7

# TODO: Kiểm tra xem number có phải số chẵn không
# Nếu chẵn: in "Số chẵn"
# Nếu lẻ: in "Số lẻ"

if number % 2 == 0:
    # Viết code của bạn ở đây
    pass
else:
    # Viết code của bạn ở đây
    pass
`,
    expectedOutput: 'Số lẻ',
    hints: [
      'Dùng toán tử % (modulo) để lấy phần dư',
      'Nếu number % 2 == 0 thì là số chẵn',
      'Ngược lại là số lẻ'
    ],
    objectives: [
      'Sử dụng câu lệnh if-else',
      'Sử dụng toán tử so sánh',
      'Hiểu logic điều kiện'
    ],
    completed: false
  },

  // ==================== ARDUINO LESSONS ====================
  {
    id: 'ard-01',
    title: 'Blink LED',
    description: 'Chương trình cơ bản - Chớp tắt đèn LED trên Arduino Uno',
    difficulty: 'easy',
    language: 'arduino',
    category: 'Cơ Bản',
    starterCode: `// Bài 1: Blink LED
// Chớp tắt đèn LED trên chân 13

const int LED_PIN = 13;

void setup() {
  // TODO: Cấu hình chân 13 là OUTPUT
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // TODO: Bật đèn LED
  digitalWrite(LED_PIN, HIGH);
  delay(1000);  // Chờ 1 giây
  
  // TODO: Tắt đèn LED
  digitalWrite(LED_PIN, LOW);
  delay(1000);  // Chờ 1 giây
}
`,
    expectedOutput: 'LED blinks every 1 second',
    hints: [
      'Sử dụng pinMode() để cấu hình chân',
      'Sử dụng digitalWrite() để bật/tắt LED',
      'HIGH = bật, LOW = tắt',
      'delay(1000) = chờ 1000ms = 1 giây'
    ],
    objectives: [
      'Hiểu cấu trúc chương trình Arduino',
      'Sử dụng hàm setup() và loop()',
      'Điều khiển LED cơ bản',
      'Sử dụng delay()'
    ],
    completed: false
  },
  {
    id: 'ard-02',
    title: 'Đèn Giao Thông',
    description: 'Mô phỏng đèn giao thông với 3 LED: Đỏ, Vàng, Xanh',
    difficulty: 'hard',
    language: 'arduino',
    category: 'Nâng Cao',
    starterCode: `// Bài 2: Đèn Giao Thông
// Mô phỏng đèn giao thông với 3 LED

const int RED_LED = 8;
const int YELLOW_LED = 9;
const int GREEN_LED = 10;

void setup() {
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
}

void loop() {
  // TODO: Bật đèn đỏ - 5 giây
  digitalWrite(RED_LED, HIGH);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(GREEN_LED, LOW);
  delay(5000);
  
  // TODO: Bật đèn vàng - 2 giây
  digitalWrite(RED_LED, LOW);
  digitalWrite(YELLOW_LED, HIGH);
  digitalWrite(GREEN_LED, LOW);
  delay(2000);
  
  // TODO: Bật đèn xanh - 5 giây
  digitalWrite(RED_LED, LOW);
  digitalWrite(YELLOW_LED, LOW);
  digitalWrite(GREEN_LED, HIGH);
  delay(5000);
}
`,
    expectedOutput: 'Traffic light cycle: Red (5s) -> Yellow (2s) -> Green (5s)',
    hints: [
      'Điều khiển 3 chân GPIO khác nhau',
      'Chỉ bật 1 đèn tại một thời điểm',
      'Sử dụng delay() để tạo thời gian chờ',
      'Lặp lại chu kỳ trong loop()'
    ],
    objectives: [
      'Điều khiển nhiều LED',
      'Tạo logic tuần tự',
      'Quản lý thời gian',
      'Hiểu vòng lặp loop()'
    ],
    completed: false
  },
  {
    id: 'ard-03',
    title: 'Nút Bấm và LED',
    description: 'Bật/tắt LED bằng nút bấm',
    difficulty: 'medium',
    language: 'arduino',
    category: 'Input/Output',
    starterCode: `// Bài 3: Nút Bấm và LED
// Bấm nút để bật/tắt LED

const int BUTTON_PIN = 2;
const int LED_PIN = 13;

void setup() {
  pinMode(BUTTON_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  // TODO: Đọc trạng thái nút bấm
  int buttonState = digitalRead(BUTTON_PIN);
  
  // TODO: Nếu nút được bấm, bật LED; ngược lại tắt LED
  if (buttonState == HIGH) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }
}
`,
    expectedOutput: 'LED turns on when button is pressed',
    hints: [
      'Sử dụng digitalRead() để đọc trạng thái nút',
      'HIGH = nút được bấm, LOW = nút không được bấm',
      'Sử dụng if-else để điều khiển LED'
    ],
    objectives: [
      'Đọc input từ nút bấm',
      'Sử dụng INPUT mode',
      'Điều khiển output dựa trên input'
    ],
    completed: false
  }
,
  {
    id: 'py-06',
    title: 'Xử Lý Chuỗi Cơ Bản',
    description: 'Làm quen với các phương thức chuỗi: lower, upper, strip, split, join',
    difficulty: 'easy',
    language: 'python',
    category: 'Chuỗi',
    starterCode: `# Bài 6: Xử Lý Chuỗi\ntext = "  Xin Chao Python  "\n\n# TODO: Chuẩn hoá chuỗi: bỏ khoảng trắng, chuyển về thường, tách từ và nối bằng dấu gạch ngang\n# Kết quả mong muốn: "xin-chao-python"\n\n`,
    expectedOutput: 'xin-chao-python',
    hints: [
      'Dùng strip() để bỏ khoảng trắng 2 đầu',
      'Dùng lower() để chuyển về chữ thường',
      'Dùng split() để tách theo khoảng trắng, join() để nối lại'
    ],
    objectives: [
      'Hiểu phương thức chuỗi',
      'Thao tác dữ liệu text',
      'Tạo pipeline xử lý đơn giản'
    ],
    completed: false
  },
  {
    id: 'py-07',
    title: 'Vòng Lặp For & Range',
    description: 'Tính tổng từ 1 đến n bằng vòng lặp for',
    difficulty: 'easy',
    language: 'python',
    category: 'Vòng Lặp',
    starterCode: `# Bài 7: For & Range\nn = 10\n# TODO: Tính tổng từ 1..n và in ra\n# Gợi ý: for i in range(1, n+1)\n\n`,
    expectedOutput: '55',
    hints: ['range(1, n+1)', 'Khởi tạo biến total = 0', 'Cộng dồn trong vòng lặp'],
    objectives: ['Dùng range()', 'Tư duy lặp', 'Cộng dồn biến'],
    completed: false
  },
  {
    id: 'py-08',
    title: 'While & Giai Thừa',
    description: 'Tính giai thừa n! bằng vòng lặp while',
    difficulty: 'medium',
    language: 'python',
    category: 'Vòng Lặp',
    starterCode: `# Bài 8: While & Factorial\nn = 5\n# TODO: Tính n! bằng while\n# Ví dụ: 5! = 120\n\n`,
    expectedOutput: '120',
    hints: ['while i <= n', 'Nhân dồn vào result', 'Giảm hoặc tăng biến vòng lặp hợp lý'],
    objectives: ['While loop', 'Nhân dồn', 'Bài toán giai thừa'],
    completed: false
  },
  {
    id: 'py-09',
    title: 'List Comprehension',
    description: 'Tạo danh sách bình phương các số chẵn từ 1..20',
    difficulty: 'medium',
    language: 'python',
    category: 'Danh Sách & Vòng Lặp',
    starterCode: `# Bài 9: List Comprehension\n# TODO: Tạo list các số bình phương chẵn từ 1..20\n# Gợi ý: [x*x for x in ... if ...]\n\n`,
    expectedOutput: '[4, 16, 36, 64, 100, 144, 196, 256, 324, 400]',
    hints: ['Điều kiện chẵn: x % 2 == 0', 'Bình phương: x*x hoặc x**2'],
    objectives: ['Tối ưu hoá vòng lặp', 'Cú pháp Pythonic', 'Lọc và biến đổi dữ liệu'],
    completed: false
  },
  {
    id: 'py-10',
    title: 'Từ Điển & Đếm Tần Suất',
    description: 'Đếm số lần xuất hiện của mỗi từ trong câu',
    difficulty: 'medium',
    language: 'python',
    category: 'Từ Điển',
    starterCode: `# Bài 10: Word Count\ntext = "ai la tri tue nhan tao ai giup hoc sinh hoc tot"\n# TODO: Tạo dict đếm tần suất từng từ\n# In ra theo dạng: {"ai": 2, ...}\n\n`,
    expectedOutput: '{"ai": 2, "la": 1, "tri": 1, "tue": 1, "nhan": 1, "tao": 1, "giup": 1, "hoc": 2, "sinh": 1, "tot": 1}',
    hints: ['Dùng split() để tách từ', 'Dùng dict.get(key, 0)+=1'],
    objectives: ['Làm việc với dict', 'Đếm tần suất', 'Xử lý văn bản'],
    completed: false
  },
  {
    id: 'py-11',
    title: 'Tập Hợp (Set) & Loại Trùng',
    description: 'Lấy danh sách số không trùng lặp',
    difficulty: 'easy',
    language: 'python',
    category: 'Tập Hợp',
    starterCode: `# Bài 11: Set - Loại Trùng\nnumbers = [1,2,2,3,4,4,5,6,6]\n# TODO: Tạo list unique từ numbers\n\n`,
    expectedOutput: '[1, 2, 3, 4, 5, 6]',
    hints: ['Dùng set() để loại trùng', 'Dùng sorted() để sắp xếp'],
    objectives: ['Hiểu set', 'Loại trùng dữ liệu', 'Chuyển đổi kiểu dữ liệu'],
    completed: false
  },
  {
    id: 'py-12',
    title: 'Hàm & Tham Số Mặc Định',
    description: 'Viết hàm chào hỏi với tham số mặc định',
    difficulty: 'easy',
    language: 'python',
    category: 'Hàm',
    starterCode: `# Bài 12: Default Params\n# TODO: Viết hàm greet(name, lang='vi') trả về "Xin chào, {name}" nếu vi, "Hello, {name}" nếu en\n\n`,
    expectedOutput: 'Xin chào, An',
    hints: ['Tham số mặc định đặt ở cuối', 'Dùng if-else theo lang'],
    objectives: ['Default params', 'Hàm trả về chuỗi', 'Xử lý ngôn ngữ'],
    completed: false
  },
  {
    id: 'py-13',
    title: 'Xử Lý Lỗi (try/except)',
    description: 'Bắt lỗi khi chuyển chuỗi sang số',
    difficulty: 'medium',
    language: 'python',
    category: 'Ngoại Lệ',
    starterCode: `# Bài 13: Try/Except\nvalue = "12a"\n# TODO: Chuyển value sang int, nếu lỗi in "Giá trị không hợp lệ"\n\n`,
    expectedOutput: 'Giá trị không hợp lệ',
    hints: ['try: int(value) / except ValueError: ...'],
    objectives: ['Bắt ngoại lệ', 'Xử lý dữ liệu đầu vào', 'An toàn chương trình'],
    completed: false
  },
  {
    id: 'py-14',
    title: 'Lập Trình Hướng Đối Tượng Cơ Bản',
    description: 'Tạo lớp Student với thuộc tính name, điểm và phương thức xếp loại',
    difficulty: 'hard',
    language: 'python',
    category: 'OOP',
    starterCode: `# Bài 14: OOP Cơ Bản\n# TODO: Tạo class Student(name, score) với method rank() trả về Gioi/Khá/Trung bình\n\n`,
    expectedOutput: 'Gioi',
    hints: ['class Student:', '__init__(self, ...)', 'Điều kiện: >=8 Giỏi, >=6.5 Khá, còn lại Trung bình'],
    objectives: ['Định nghĩa class', 'Phương thức & thuộc tính', 'Tư duy OOP'],
    completed: false
  },
  {
    id: 'py-15',
    title: 'Đệ Quy: Fibonacci',
    description: 'Viết hàm đệ quy tính số Fibonacci thứ n',
    difficulty: 'hard',
    language: 'python',
    category: 'Thuật Toán',
    starterCode: `# Bài 15: Fibonacci Đệ Quy\n# TODO: Viết hàm fib(n) trả về số Fibonacci thứ n\n\n`,
    expectedOutput: 'fib(6) = 8',
    hints: ['Cơ sở: fib(0)=0, fib(1)=1', 'Công thức: fib(n)=fib(n-1)+fib(n-2)'],
    objectives: ['Tư duy đệ quy', 'Xác định điểm dừng', 'Tối ưu hoá (gợi ý: memoization)'],
    completed: false
  },
  {
    id: 'ard-04',
    title: 'Morse SOS với LED',
    description: 'Chớp LED chân 13 theo mã SOS (... --- ...)',
    difficulty: 'medium',
    language: 'arduino',
    category: 'Mẫu Nhấp Nháy',
    starterCode: `// Bài 4: SOS Morse\nconst int LED_PIN = 13;\n\nvoid dot(){ digitalWrite(LED_PIN, HIGH); delay(200); digitalWrite(LED_PIN, LOW); delay(200);}\nvoid dash(){ digitalWrite(LED_PIN, HIGH); delay(600); digitalWrite(LED_PIN, LOW); delay(200);}\n\nvoid setup(){ pinMode(LED_PIN, OUTPUT);}\nvoid loop(){\n  // TODO: ... --- ...\n  for(int i=0;i<3;i++) dot();\n  delay(200);\n  for(int i=0;i<3;i++){ dash(); }\n  delay(200);\n  for(int i=0;i<3;i++) dot();\n  delay(1000);\n}\n`,
    expectedOutput: 'LED blinks in SOS pattern',
    hints: ['Hàm dot() là chớp ngắn, dash() là chớp dài', 'Chu kỳ: ... --- ...'],
    objectives: ['Tổ chức mã thành hàm', 'Tái sử dụng code', 'Hiểu pattern thời gian'],
    completed: false
  },
  {
    id: 'ard-05',
    title: 'Knight Rider (LED chạy qua lại)',
    description: 'Chạy LED lần lượt qua các chân 8,9,10,13 rồi quay lại',
    difficulty: 'medium',
    language: 'arduino',
    category: 'Mẫu Nhấp Nháy',
    starterCode: `// Bài 5: Knight Rider\nconst int PINS[4] = {8,9,10,13};\nvoid setup(){ for(int i=0;i<4;i++) pinMode(PINS[i], OUTPUT);}\nvoid allOff(){ for(int i=0;i<4;i++) digitalWrite(PINS[i], LOW);}\nvoid loop(){\n  // TODO: Chạy sang phải\n  for(int i=0;i<4;i++){ allOff(); digitalWrite(PINS[i], HIGH); delay(120);}\n  // TODO: Chạy sang trái\n  for(int i=2;i>=1;i--){ allOff(); digitalWrite(PINS[i], HIGH); delay(120);}\n}\n`,
    expectedOutput: 'LEDs sweep back and forth',
    hints: ['Dùng mảng chân', 'Tắt hết trước khi bật 1 LED'],
    objectives: ['Mảng & vòng lặp', 'Hiệu ứng thị giác', 'Quản lý trạng thái'],
    completed: false
  },
  {
    id: 'ard-06',
    title: 'Nút Bấm Toggle LED',
    description: 'Mỗi lần bấm nút, LED đổi trạng thái (ON/OFF)',
    difficulty: 'medium',
    language: 'arduino',
    category: 'Input/Output',
    starterCode: `// Bài 6: Toggle LED\nconst int BUTTON_PIN = 2;\nconst int LED_PIN = 13;\nbool ledOn = false;\nvoid setup(){ pinMode(BUTTON_PIN, INPUT); pinMode(LED_PIN, OUTPUT);}\nvoid loop(){\n  // TODO: Khi nút HIGH, đảo trạng thái ledOn và chờ thả nút\n  if(digitalRead(BUTTON_PIN)==HIGH){\n    ledOn = !ledOn;\n    digitalWrite(LED_PIN, ledOn?HIGH:LOW);\n    while(digitalRead(BUTTON_PIN)==HIGH){} // đợi thả nút\n    delay(50); // debounce nhẹ\n  }\n}\n`,
    expectedOutput: 'Press to toggle LED',
    hints: ['Đợi thả nút để tránh lặp lại', 'ledOn = !ledOn'],
    objectives: ['Trạng thái & sự kiện', 'Chống rung đơn giản', 'Điều khiển đầu ra'],
    completed: false
  },
  {
    id: 'ard-07',
    title: 'Debounce Nút Bấm',
    description: 'Chống rung nút bằng delay ngắn',
    difficulty: 'medium',
    language: 'arduino',
    category: 'Input/Output',
    starterCode: `// Bài 7: Debounce\nconst int BUTTON_PIN = 2;\nconst int LED_PIN = 13;\nvoid setup(){ pinMode(BUTTON_PIN, INPUT); pinMode(LED_PIN, OUTPUT);}\nvoid loop(){\n  int s = digitalRead(BUTTON_PIN);\n  if(s==HIGH){ digitalWrite(LED_PIN, !digitalRead(LED_PIN)); delay(200); }\n}\n`,
    expectedOutput: 'Stable button presses',
    hints: ['delay(200) để bỏ nhiễu', 'Có thể cải tiến bằng millis()'],
    objectives: ['Chống rung', 'Đọc input ổn định', 'Trải nghiệm thực tế'],
    completed: false
  },
  {
    id: 'ard-08',
    title: 'Hai Nút Điều Khiển Một LED',
    description: 'Nút A bật LED, Nút B tắt LED',
    difficulty: 'easy',
    language: 'arduino',
    category: 'Input/Output',
    starterCode: `// Bài 8: Hai Nút - Một LED\nconst int A=2, B=3, LED=13;\nvoid setup(){ pinMode(A,INPUT); pinMode(B,INPUT); pinMode(LED,OUTPUT);}\nvoid loop(){\n  if(digitalRead(A)==HIGH) digitalWrite(LED, HIGH);\n  if(digitalRead(B)==HIGH) digitalWrite(LED, LOW);\n}\n`,
    expectedOutput: 'One button ON, one button OFF',
    hints: ['Đọc từng nút', 'Không chặn chương trình'],
    objectives: ['Nhiều input', 'Logic điều kiện', 'Điều khiển đơn giản'],
    completed: false
  },
  {
    id: 'ard-09',
    title: 'Đổi Tốc Độ Nhấp Nháy',
    description: 'Chuyển đổi giữa nhanh/chậm bằng nút bấm',
    difficulty: 'medium',
    language: 'arduino',
    category: 'Mẫu Nhấp Nháy',
    starterCode: `// Bài 9: Blink Speed Toggle\nconst int BUTTON=2, LED=13;\nbool fast=false;\nvoid setup(){ pinMode(BUTTON,INPUT); pinMode(LED,OUTPUT);}\nvoid loop(){\n  if(digitalRead(BUTTON)==HIGH){ fast = !fast; delay(200);}\n  digitalWrite(LED, HIGH); delay(fast?150:600);\n  digitalWrite(LED, LOW);  delay(fast?150:600);\n}\n`,
    expectedOutput: 'Blink speed toggles on press',
    hints: ['Dùng biến fast boolean', 'Chống rung 200ms'],
    objectives: ['State toggle', 'Time control', 'Trải nghiệm tương tác'],
    completed: false
  },
  {
    id: 'ard-10',
    title: 'Chuỗi LED Tuỳ Biến',
    description: 'Thiết kế pattern LED riêng với mảng trạng thái',
    difficulty: 'hard',
    language: 'arduino',
    category: 'Mẫu Nhấp Nháy',
    starterCode: `// Bài 10: Pattern Tuỳ Biến\nconst int P[4]={8,9,10,13};\nint frames[6][4]={{1,0,0,0},{0,1,0,0},{0,0,1,0},{0,0,0,1},{0,1,0,1},{1,0,1,0}};\nvoid setup(){ for(int i=0;i<4;i++) pinMode(P[i],OUTPUT);}\nvoid apply(int f[]){ for(int i=0;i<4;i++) digitalWrite(P[i], f[i]?HIGH:LOW);}\nvoid loop(){ for(int k=0;k<6;k++){ apply(frames[k]); delay(200);} }\n`,
    expectedOutput: 'Custom LED animation',
    hints: ['Mỗi frame là 1 trạng thái', 'Duyệt tuần tự qua các frame'],
    objectives: ['Mảng 2 chiều', 'Thiết kế pattern', 'Trừu tượng hoá apply()'],
    completed: false
  },
  {
    id: 'ard-11',
    title: 'Đèn Giao Thông Có Nút Bấm',
    description: 'Thêm nút người đi bộ: bấm thì bật đỏ (xe dừng)',
    difficulty: 'hard',
    language: 'arduino',
    category: 'Nâng Cao',
    starterCode: `// Bài 11: Đèn Giao Thông + Nút\nconst int RED=8, YLW=9, GRN=10, BTN=2;\nvoid setup(){ pinMode(RED,OUTPUT); pinMode(YLW,OUTPUT); pinMode(GRN,OUTPUT); pinMode(BTN,INPUT);}\nvoid show(int r,int y,int g){ digitalWrite(RED,r); digitalWrite(YLW,y); digitalWrite(GRN,g);}\nvoid normal(){ show(HIGH,LOW,LOW); delay(4000); show(LOW,HIGH,LOW); delay(1000); show(LOW,LOW,HIGH); delay(4000);}\nvoid loop(){\n  if(digitalRead(BTN)==HIGH){ show(HIGH,LOW,LOW); delay(5000);} else { normal(); }\n}\n`,
    expectedOutput: 'Traffic with pedestrian override',
    hints: ['Tách hàm normal()', 'Khi bấm nút, ưu tiên đèn đỏ'],
    objectives: ['Quản lý trạng thái', 'Xử lý sự kiện ưu tiên', 'Thiết kế hàm tiện ích'],
    completed: false
  }
,
  {
    id: 'py-16',
    title: 'Đọc/Ghi File Cơ Bản',
    description: 'Làm việc với file text: ghi dữ liệu và đọc lại',
    difficulty: 'medium',
    language: 'python',
    category: 'File I/O',
    starterCode: `# Bài 16: File I/O\n# TODO: Ghi 3 dòng vào file data.txt rồi đọc lại và in ra\n# Gợi ý: with open('data.txt','w') as f: ...\n\n`,
    expectedOutput: 'dong1\ndong2\ndong3',
    hints: ['Dùng with open()', "mode 'w' để ghi, 'r' để đọc", 'Nhớ close file khi không dùng with'],
    objectives: ['File write/read', 'Context manager', 'Quy trình I/O'],
    completed: false
  },
  {
    id: 'py-17',
    title: 'Sắp Xếp Danh Sách',
    description: 'Sắp xếp danh sách điểm giảm dần và lấy top 3',
    difficulty: 'medium',
    language: 'python',
    category: 'Danh Sách',
    starterCode: `# Bài 17: Sort\nscores = [7.5, 9.2, 8.0, 6.8, 9.0]\n# TODO: Sắp xếp giảm dần và in top 3\n\n`,
    expectedOutput: '[9.2, 9.0, 8.0]',
    hints: ['sorted(scores, reverse=True)', 'Lấy [:3]'],
    objectives: ['Sắp xếp', 'Cắt danh sách', 'Tư duy dữ liệu'],
    completed: false
  },
  {
    id: 'py-18',
    title: 'Map/Filter/Reduce',
    description: 'Áp dụng map/filter để lọc số chẵn và nhân đôi',
    difficulty: 'medium',
    language: 'python',
    category: 'Functional',
    starterCode: `# Bài 18: Map-Filter\nnums = [1,2,3,4,5,6]\n# TODO: Lọc số chẵn rồi nhân đôi\n# Kết quả: [4,8,12]\n\n`,
    expectedOutput: '[4, 8, 12]',
    hints: ['filter(lambda x: x%2==0, nums)', 'map(lambda x: x*2, ...)'],
    objectives: ['Tư duy hàm', 'Biến đổi dữ liệu', 'Lọc & ánh xạ'],
    completed: false
  },
  {
    id: 'py-19',
    title: 'Enumerate & Zip',
    description: 'Ghép tên học sinh với điểm và in theo thứ tự',
    difficulty: 'easy',
    language: 'python',
    category: 'Danh Sách',
    starterCode: `# Bài 19: Enumerate & Zip\nnames = ['An','Bình','Chi']\nscores = [8.5, 7.0, 9.2]\n# TODO: In dạng: 1. An - 8.5\n\n`,
    expectedOutput: '1. An - 8.5\n2. Bình - 7.0\n3. Chi - 9.2',
    hints: ['for i,(n,s) in enumerate(zip(names, scores), start=1): ...'],
    objectives: ['Duyệt song song', 'Đánh số thứ tự', 'Format chuỗi'],
    completed: false
  },
  {
    id: 'py-20',
    title: 'JSON & Lưu Cấu Hình',
    description: 'Lưu cấu hình dưới dạng JSON và đọc lại',
    difficulty: 'medium',
    language: 'python',
    category: 'Dữ Liệu',
    starterCode: `# Bài 20: JSON\nimport json\nconfig = {"lang":"vi","theme":"dark","font":14}\n# TODO: Ghi config vào file config.json rồi đọc lại và in ra lang\n\n`,
    expectedOutput: 'vi',
    hints: ['json.dump(obj, f)', 'json.load(f)'],
    objectives: ['Lưu/đọc JSON', 'Quản lý cấu hình', 'Kỹ năng thực tế'],
    completed: false
  },
  {
    id: 'py-21',
    title: 'Unit Test Cơ Bản',
    description: 'Viết test đơn giản cho hàm cộng',
    difficulty: 'hard',
    language: 'python',
    category: 'Testing',
    starterCode: `# Bài 21: Unit Test\n# TODO: Viết hàm add(a,b) và test với vài case đơn giản\n\n`,
    expectedOutput: 'All tests passed',
    hints: ['Tự in ra kết quả PASS/FAIL', 'So sánh kỳ vọng và thực tế'],
    objectives: ['Tư duy kiểm thử', 'Thiết kế case test', 'So sánh kết quả'],
    completed: false
  },
  {
    id: 'py-22',
    title: 'Thuật Toán: Tìm Kiếm Tuyến Tính',
    description: 'Tìm vị trí phần tử x trong danh sách (trả về -1 nếu không có)',
    difficulty: 'easy',
    language: 'python',
    category: 'Thuật Toán',
    starterCode: `# Bài 22: Linear Search\narr = [3,8,2,7,9]\nx = 7\n# TODO: In ra vị trí của x\n\n`,
    expectedOutput: '3',
    hints: ['Duyệt arr với enumerate', 'Nếu bằng x thì in index và dừng'],
    objectives: ['Thuật toán cơ bản', 'Duyệt tuyến tính', 'So sánh'],
    completed: false
  },
  {
    id: 'ard-12',
    title: 'PWM: Nhấp Nháy Mờ Dần',
    description: 'Dùng PWM để tăng/giảm độ sáng LED (pin 9)',
    difficulty: 'medium',
    language: 'arduino',
    category: 'PWM',
    starterCode: `// Bài 12: Fade\nconst int LED=9;\nvoid setup(){ pinMode(LED,OUTPUT);} \nvoid loop(){ for(int v=0; v<=255; v+=5){ analogWrite(LED,v); delay(15);} for(int v=255; v>=0; v-=5){ analogWrite(LED,v); delay(15);} }\n`,
    expectedOutput: 'LED fades in/out',
    hints: ['analogWrite trên chân PWM (3,5,6,9,10,11)', 'Tăng/giảm giá trị 0..255'],
    objectives: ['PWM cơ bản', 'Điều khiển độ sáng', 'Hiệu ứng mượt'],
    completed: false
  },
  {
    id: 'ard-13',
    title: 'Servo Sweep',
    description: 'Quét servo từ 0→180 và ngược lại',
    difficulty: 'hard',
    language: 'arduino',
    category: 'Actuator',
    starterCode: `// Bài 13: Servo Sweep\n#include <Servo.h>\nServo sv;\nvoid setup(){ sv.attach(10);} \nvoid loop(){ for(int a=0;a<=180;a+=5){ sv.write(a); delay(20);} for(int a=180;a>=0;a-=5){ sv.write(a); delay(20);} }\n`,
    expectedOutput: 'Servo sweeps back and forth',
    hints: ['Sử dụng thư viện Servo', 'attach() tới chân PWM'],
    objectives: ['Điều khiển servo', 'Chu kỳ quét', 'Hiểu phần cứng cơ bản'],
    completed: false
  },
  {
    id: 'ard-14',
    title: 'Đọc Biến Trở Điều Khiển Độ Sáng',
    description: 'Đọc analog từ A0 và xuất PWM ra LED (9)',
    difficulty: 'medium',
    language: 'arduino',
    category: 'Sensor',
    starterCode: `// Bài 14: Potentiometer\nconst int POT=A0, LED=9;\nvoid setup(){ pinMode(LED,OUTPUT);} \nvoid loop(){ int v=analogRead(POT); int pwm=map(v,0,1023,0,255); analogWrite(LED,pwm); }\n`,
    expectedOutput: 'LED brightness follows potentiometer',
    hints: ['analogRead trả 0..1023', 'map() để chuyển sang 0..255'],
    objectives: ['Đọc cảm biến', 'Mapping giá trị', 'Điều khiển PWM'],
    completed: false
  },
  {
    id: 'ard-15',
    title: 'Melody với Buzzer',
    description: 'Phát giai điệu ngắn bằng hàm tone()',
    difficulty: 'medium',
    language: 'arduino',
    category: 'Âm Thanh',
    starterCode: `// Bài 15: Melody\nconst int BUZ=8;\nint notes[4]={262,294,330,349};\nvoid setup(){}\nvoid loop(){ for(int i=0;i<4;i++){ tone(BUZ, notes[i], 200); delay(250);} noTone(BUZ); delay(500);}\n`,
    expectedOutput: 'Buzzer plays a short melody',
    hints: ['tone(pin, freq, duration)', 'noTone(pin) để dừng'],
    objectives: ['Âm thanh cơ bản', 'Chuỗi nốt nhạc', 'Thời gian & nhịp'],
    completed: false
  },
  {
    id: 'ard-16',
    title: 'Phát Hiện Vật Cản (giả lập)',
    description: 'Mô phỏng cảm biến siêu âm: nếu khoảng cách < 20cm bật LED đỏ',
    difficulty: 'hard',
    language: 'arduino',
    category: 'Sensor',
    starterCode: `// Bài 16: Ultrasonic (Mock)\n// Gợi ý: biến distance giả lập thay đổi và điều khiển LED đỏ (8)\nconst int RED=8; int distance=50;\nvoid setup(){ pinMode(RED,OUTPUT);} \nvoid loop(){ distance -= 5; if(distance<0) distance=50; digitalWrite(RED, distance<20?HIGH:LOW); delay(200);}\n`,
    expectedOutput: 'Red LED turns on when distance < 20cm',
    hints: ['Giả lập dữ liệu cảm biến bằng biến tăng/giảm', 'Điều kiện ngưỡng'],
    objectives: ['Tư duy đọc sensor', 'Ngưỡng quyết định', 'An toàn'],
    completed: false
  }
];

// Helper functions
export const getLessonsByLanguage = (language: 'python' | 'arduino') => {
  return codingLessons.filter(lesson => lesson.language === language);
};

export const getLessonsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  return codingLessons.filter(lesson => lesson.difficulty === difficulty);
};

export const getLessonById = (id: string) => {
  return codingLessons.find(lesson => lesson.id === id);
};

export const getCategories = (language: 'python' | 'arduino') => {
  const lessons = getLessonsByLanguage(language);
  return [...new Set(lessons.map(lesson => lesson.category))];
};

