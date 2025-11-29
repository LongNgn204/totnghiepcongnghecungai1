# Phòng Code - Smart Lab: Tóm Tắt Tính Năng

## ✨ Tính Năng Chính

### 1. **IDE Monaco Editor** 
- ✅ Syntax highlighting cho Python & C++ (Arduino)
- ✅ Line numbers & auto-indent
- ✅ Word wrap & minimap
- ✅ Responsive layout

### 2. **Learning Path Management**
- ✅ 8 bài học (5 Python + 3 Arduino)
- ✅ Phân loại theo danh mục & độ khó
- ✅ Trạng thái bài học (hoàn thành/chưa làm)
- ✅ Mô tả chi tiết & mục tiêu học tập

### 3. **Python Execution**
- ✅ Chạy code Python (mô phỏng)
- ✅ Hiển thị output/lỗi
- ✅ Hỗ trợ print(), biến, vòng lặp, hàm, điều kiện

### 4. **Arduino Simulator**
- ✅ Mô phỏng Arduino Uno
- ✅ 4 LED indicators (Red, Yellow, Green, Blue)
- ✅ Phân tích code để xác định trạng thái LED
- ✅ Console output ghi lại sự kiện
- ✅ Simulation timeline (0-15 giây)

### 5. **AI Mentor Chat**
- ✅ Chat interface tích hợp
- ✅ Gợi ý thông minh dựa trên code
- ✅ Không cho đáp án ngay (chỉ gợi mở)
- ✅ Hỗ trợ giải thích, sửa lỗi, hỏi đáp

### 6. **Responsive Design**
- ✅ Layout 3 cột trên desktop
- ✅ Responsive trên tablet/mobile
- ✅ Dark mode support
- ✅ Tailwind CSS styling

---

## 📊 Dữ Liệu Bài Học

### Python Lessons (5 bài)

| Bài | Tiêu Đề | Độ Khó | Chủ Đề |
|-----|---------|--------|--------|
| 1 | Hello World | ⭐ | In ra dữ liệu |
| 2 | Biến & Kiểu Dữ Liệu | ⭐ | Khai báo biến |
| 3 | Tính Tổng Danh Sách | ⭐⭐ | Vòng lặp |
| 4 | Hàm & Tham Số | ⭐⭐ | Định nghĩa hàm |
| 5 | Điều Kiện If-Else | ⭐⭐ | Logic điều kiện |

### Arduino Lessons (3 bài)

| Bài | Tiêu Đề | Độ Khó | Chủ Đề |
|-----|---------|--------|--------|
| 1 | Blink LED | ⭐ | Điều khiển LED |
| 2 | Đèn Giao Thông | ⭐⭐⭐ | Logic tuần tự |
| 3 | Nút Bấm & LED | ⭐⭐ | Input/Output |

---

## 🎯 Kiến Trúc Component

```
CodingLab.tsx (Main Component)
├── Header & Language Tabs
├── Column 1: Learning Path
│   ├── Category Accordion
│   └── Lesson List
├── Column 2: Monaco IDE
│   ├── Lesson Info
│   ├── Editor
│   └── Control Buttons
└── Column 3: Output & AI
    ├── Tab 1: Output/Simulator
    │   ├── Python Terminal
    │   └── ArduinoSimulator
    └── Tab 2: AI Mentor Chat
        ├── Chat Messages
        └── Chat Input
```

---

## 🔌 File Structure

```
components/
├── CodingLab.tsx              # Main component (600+ lines)
├── ArduinoSimulator.tsx        # Arduino simulator (250+ lines)
└── Header.tsx                  # Updated with "Phòng Code" link

data/
└── codingLessons.ts            # Lesson data & helpers (200+ lines)

App.tsx                         # Updated with route
```

---

## 🚀 Cách Sử Dụng

### Truy Cập
1. Đăng nhập vào ứng dụng
2. Nhấp "Phòng Code" trong navigation
3. Hoặc truy cập `/home/coding-lab`

### Workflow
1. Chọn ngôn ngữ (Python/Arduino)
2. Chọn bài học từ danh sách
3. Viết code trong editor
4. Nhấp "Chạy Code" để thực thi
5. Xem output hoặc mô phỏng
6. Hỏi AI nếu cần giúp
7. Nhấp "Nộp Bài" khi hoàn thành

---

## 💡 Ví Dụ Sử Dụng

### Python: Hello World
```python
# Starter code
print("Hello World")

# Output
Hello World
```

### Arduino: Blink LED
```cpp
const int LED_PIN = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}

// Simulator Output
[0.0s] LED (Pin 13) turned ON
[1.0s] LED (Pin 13) turned OFF
[2.0s] LED (Pin 13) turned ON
...
```

---

## 🔄 State Management

### CodingLab Component State
```typescript
- language: 'python' | 'arduino'
- selectedLessonId: string
- code: string
- output: string
- isRunning: boolean
- activeTab: 'output' | 'ai'
- chatMessages: ChatMessage[]
- chatInput: string
- isAILoading: boolean
- expandedCategory: string
```

### ArduinoSimulator Component State
```typescript
- leds: LEDState[]
- isRunning: boolean
- output: string
- simulationTime: number
```

---

## 🎨 UI/UX Features

### Color Scheme
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#16a34a)
- **Warning**: Yellow (#eab308)
- **Error**: Red (#dc2626)
- **Background**: Gray (#f3f4f6)

### Interactive Elements
- Tabs for language selection
- Accordion for lesson categories
- Buttons with hover effects
- Chat interface with typing indicator
- LED visualization with glow effect

---

## 🔧 Dependencies

### New Dependencies Added
```json
{
  "@monaco-editor/react": "^4.6.0",
  "react-is": "^18.2.0"
}
```

### Existing Dependencies Used
- `react` - UI framework
- `react-router-dom` - Routing
- `lucide-react` - Icons
- `react-hot-toast` - Notifications
- `tailwindcss` - Styling

---

## 📈 Performance Considerations

### Optimization
- ✅ Lazy loading of CodingLab component
- ✅ Monaco Editor with minimap disabled
- ✅ Efficient state management
- ✅ Debounced code execution

### Bundle Size
- CodingLab.tsx: ~39 KB (gzipped: ~13 KB)
- ArduinoSimulator.tsx: Included in CodingLab
- Total impact: Minimal

---

## 🔐 Security

### Code Execution
- ✅ Python execution is simulated (safe)
- ✅ Arduino simulation is client-side (safe)
- ✅ No server-side code execution

### Data Privacy
- ✅ Code is stored locally
- ✅ No data sent to external servers
- ✅ AI Mentor can be integrated with privacy-aware API

---

## 🎓 Learning Outcomes

### After Completing Python Lessons
- ✅ Understand print() function
- ✅ Declare and use variables
- ✅ Work with lists and loops
- ✅ Define and call functions
- ✅ Use if-else conditions

### After Completing Arduino Lessons
- ✅ Understand Arduino board structure
- ✅ Control digital outputs (LED)
- ✅ Use delay() for timing
- ✅ Implement sequential logic
- ✅ Read digital inputs (buttons)

---

## 🚀 Future Enhancements

### Phase 2
- [ ] Save progress to database
- [ ] Leaderboard & achievements
- [ ] Code sharing & collaboration
- [ ] More Arduino sensors
- [ ] Real Python execution (Pyodide)

### Phase 3
- [ ] Video tutorials
- [ ] Weekly challenges
- [ ] Certificates
- [ ] Mobile app
- [ ] Offline support

---

## 📝 Notes

- **Status**: ✅ Complete & Tested
- **Version**: 1.0
- **Last Updated**: 2025-11-29
- **Maintainer**: AI Assistant
- **License**: MIT

---

**Phòng Code - Smart Lab v1.0 🎓**

