# HƯỚNG DẪN TỐI ƯU HÓA TỪNG TRANG

## 1. HOME PAGE - TRANG CHỦ

### Hiện tại
- Hero section cố định
- Feature cards không responsive
- Footer không tối ưu mobile

### Nâng cấp

#### Hero Section
```tsx
// components/Home.tsx - Hero Section
<section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-600 py-12 md:py-20 lg:py-32">
  <Container>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      
      {/* Left Content */}
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Học Tập Thông Minh Cùng AI
        </h1>
        
        <p className="text-base md:text-lg text-blue-100 leading-relaxed">
          Nền tảng học tập tương tác với công nghệ AI, giúp bạn học hiệu quả hơn
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="w-full sm:w-auto">
            Bắt Đầu Ngay
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Tìm Hiểu Thêm
          </Button>
        </div>
      </div>

      {/* Right Image */}
      <div className="hidden md:block">
        <img 
          src="/images/hero-banner.png" 
          alt="Hero Banner"
          className="w-full h-auto"
        />
      </div>
    </div>
  </Container>
</section>
```

#### Feature Cards
```tsx
// Feature Cards - Responsive Grid
<section className="py-12 md:py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
  <Container>
    <div className="text-center mb-12 md:mb-16">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
        Tính Năng Nổi Bật
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
        Khám phá những tính năng giúp bạn học tập hiệu quả
      </p>
    </div>

    <Grid cols={{ mobile: 1, tablet: 2, desktop: 3 }} gap="lg">
      {features.map((feature) => (
        <Card key={feature.id} variant="elevated" hoverable>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              {feature.icon}
            </div>
            <h3 className="text-lg md:text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              {feature.description}
            </p>
          </div>
        </Card>
      ))}
    </Grid>
  </Container>
</section>
```

#### CTA Section
```tsx
// Call-to-Action Section
<section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
  <Container>
    <div className="text-center space-y-6">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
        Sẵn Sàng Bắt Đầu?
      </h2>
      <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
        Tham gia hàng ngàn học sinh đang học tập cùng AI
      </p>
      <Button size="lg" className="w-full sm:w-auto">
        Đăng Ký Miễn Phí
      </Button>
    </div>
  </Container>
</section>
```

---

## 2. DASHBOARD PAGE

### Hiện tại
- Sidebar cố định
- Stats cards không responsive
- Charts không tối ưu mobile

### Nâng cấp

#### Layout
```tsx
// components/Dashboard.tsx
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-white dark:bg-gray-800 shadow-lg flex-col">
        {/* Sidebar content */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
            {/* Sidebar content */}
          </div>
        )}

        {/* Page Content */}
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          
          {/* Stats Grid */}
          <Grid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
            {stats.map((stat) => (
              <Card key={stat.id}>
                <div className="space-y-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-green-600">
                    {stat.change}
                  </p>
                </div>
              </Card>
            ))}
          </Grid>

          {/* Charts Section */}
          <Grid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="lg">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Tiến Độ Học Tập</h3>
              {/* Chart component - responsive */}
            </Card>
            <Card>
              <h3 className="text-lg font-semibold mb-4">Thống Kê Hoạt Động</h3>
              {/* Chart component - responsive */}
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">Hoạt Động Gần Đây</h3>
            <div className="space-y-3">
              {/* Activity list */}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};
```

#### Stats Cards
```tsx
// Responsive Stats Card
<Card className="p-4 md:p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </p>
      <p className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2">
        {value}
      </p>
    </div>
    <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
      {icon}
    </div>
  </div>
  <p className="text-xs md:text-sm text-green-600 mt-3">
    {change}
  </p>
</Card>
```

---

## 3. EXAM PAGE

### Hiện tại
- Question layout cố định
- Answer options không responsive
- Timer không tối ưu mobile

### Nâng cấp

#### Exam Layout
```tsx
// components/ExamInterface.tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  
  {/* Header */}
  <div className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
    <Container>
      <div className="py-3 md:py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-bold">
          {examTitle}
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Thời gian còn lại
            </p>
            <p className="text-lg md:text-2xl font-bold text-red-600">
              {timeRemaining}
            </p>
          </div>
          <Button variant="ghost" size="sm">
            Thoát
          </Button>
        </div>
      </div>
    </Container>
  </div>

  {/* Main Content */}
  <Container className="py-6 md:py-8">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Question Area */}
      <div className="lg:col-span-3">
        <Card className="p-6 md:p-8">
          
          {/* Question */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Câu {currentQuestion} / {totalQuestions}
            </p>
            <h2 className="text-xl md:text-2xl font-semibold mb-6">
              {question.text}
            </h2>
            
            {/* Question Image */}
            {question.image && (
              <img 
                src={question.image} 
                alt="Question"
                className="w-full max-w-md h-auto rounded-lg mb-6"
              />
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3 md:space-y-4">
            {question.options.map((option, index) => (
              <label
                key={index}
                className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  className="w-5 h-5 md:w-6 md:h-6 mt-0.5"
                  onChange={() => handleSelectAnswer(index)}
                />
                <span className="ml-3 md:ml-4 text-base md:text-lg">
                  {option}
                </span>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 md:flex-none"
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
            >
              Câu Trước
            </Button>
            <Button
              size="lg"
              className="flex-1 md:flex-none"
              onClick={handleNext}
            >
              Câu Tiếp Theo
            </Button>
          </div>
        </Card>
      </div>

      {/* Sidebar - Question Navigator */}
      <div className="hidden lg:block">
        <Card className="p-4 sticky top-24">
          <h3 className="font-semibold mb-4">Danh Sách Câu Hỏi</h3>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <button
                key={i}
                className={`w-full aspect-square rounded-lg font-medium transition-colors ${
                  i === currentQuestion - 1
                    ? 'bg-blue-600 text-white'
                    : answeredQuestions.includes(i)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => goToQuestion(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </Container>
</div>
```

---

## 4. PRODUCT PAGES (Product1-8)

### Hiện tại
- Content layout cố định
- Images không responsive
- Sidebar không tối ưu mobile

### Nâng cấp

#### Product Layout
```tsx
// components/ProductTemplate.tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <Header />
  
  <Container className="py-8 md:py-12">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
      
      {/* Main Content */}
      <div className="lg:col-span-3">
        
        {/* Hero Image */}
        <Card className="mb-8 overflow-hidden">
          <img 
            src={heroImage}
            alt="Product"
            className="w-full h-auto object-cover aspect-video md:aspect-auto"
          />
        </Card>

        {/* Content Sections */}
        <div className="space-y-8">
          
          {/* Introduction */}
          <Card className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              {title}
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {introduction}
            </p>
          </Card>

          {/* Key Points */}
          <Card className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Điểm Chính</h2>
            <Grid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="md">
              {keyPoints.map((point, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{point.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </Grid>
          </Card>

          {/* Content Sections */}
          {contentSections.map((section, i) => (
            <Card key={i} className="p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                {section.title}
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                {section.content}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          
          {/* Quick Info */}
          <Card className="p-4 md:p-6 sticky top-24">
            <h3 className="font-bold mb-4">Thông Tin Nhanh</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Cấp Độ</p>
                <p className="font-semibold">{level}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Thời Lượng</p>
                <p className="font-semibold">{duration}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Bài Học</p>
                <p className="font-semibold">{lessonsCount}</p>
              </div>
            </div>
            <Button className="w-full mt-4">Bắt Đầu</Button>
          </Card>

          {/* Related Products */}
          <Card className="p-4 md:p-6">
            <h3 className="font-bold mb-4">Bài Học Liên Quan</h3>
            <div className="space-y-3">
              {relatedProducts.map((product) => (
                <a
                  key={product.id}
                  href={product.link}
                  className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <p className="text-sm font-medium">{product.title}</p>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  </Container>
</div>
```

---

## 5. FLASHCARD PAGE

### Nâng cấp

#### Flashcard Layout
```tsx
// components/Flashcards.tsx
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 md:py-12">
  <Container>
    
    {/* Header */}
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
        Flashcard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {currentCard} / {totalCards}
      </p>
    </div>

    {/* Flashcard */}
    <div className="mb-8">
      <div
        className="w-full aspect-video md:aspect-auto md:h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-12 flex items-center justify-center cursor-pointer transform transition-transform hover:scale-105"
        onClick={handleFlip}
      >
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isFlipped ? 'Đáp Án' : 'Câu Hỏi'}
          </p>
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
            {isFlipped ? currentCard.answer : currentCard.question}
          </p>
        </div>
      </div>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Nhấp để lật thẻ
      </p>
    </div>

    {/* Controls */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
      <Button
        variant="secondary"
        size="lg"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="flex-1 sm:flex-none"
      >
        Trước
      </Button>
      <Button
        size="lg"
        onClick={handleNext}
        disabled={currentIndex === totalCards - 1}
        className="flex-1 sm:flex-none"
      >
        Tiếp Theo
      </Button>
    </div>

    {/* Progress */}
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${(currentIndex / totalCards) * 100}%` }}
      />
    </div>

    {/* Stats */}
    <Grid cols={{ mobile: 1, tablet: 3, desktop: 3 }} gap="md">
      <Card className="text-center p-4 md:p-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm">Đã Học</p>
        <p className="text-2xl md:text-3xl font-bold mt-2">{learned}</p>
      </Card>
      <Card className="text-center p-4 md:p-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm">Đang Học</p>
        <p className="text-2xl md:text-3xl font-bold mt-2">{learning}</p>
      </Card>
      <Card className="text-center p-4 md:p-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm">Chưa Học</p>
        <p className="text-2xl md:text-3xl font-bold mt-2">{notLearned}</p>
      </Card>
    </Grid>
  </Container>
</div>
```

---

## 6. LEADERBOARD PAGE

### Nâng cấp

#### Leaderboard Layout
```tsx
// components/Leaderboard.tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
  <Container>
    
    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
      Bảng Xếp Hạng
    </h1>

    {/* Filters */}
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <select className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800">
        <option>Tuần Này</option>
        <option>Tháng Này</option>
        <option>Tất Cả Thời Gian</option>
      </select>
      <select className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800">
        <option>Tất Cả Lớp</option>
        <option>Lớp 6</option>
        <option>Lớp 7</option>
      </select>
    </div>

    {/* Top 3 */}
    <Grid cols={{ mobile: 1, tablet: 3, desktop: 3 }} gap="lg" className="mb-8">
      {topThree.map((user, index) => (
        <Card key={user.id} className="p-6 text-center">
          <div className="text-4xl mb-2">
            {index === 0 ? '[object Object]1 ? '🥈' : '🥉'}
          </div>
          <h3 className="font-bold text-lg mb-2">{user.name}</h3>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {user.points} điểm
          </p>
        </Card>
      ))}
    </Grid>

    {/* Leaderboard Table */}
    <Card className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold">Hạng</th>
            <th className="px-4 md:px-6 py-3 text-left text-sm font-semibold">Tên</th>
            <th className="px-4 md:px-6 py-3 text-right text-sm font-semibold">Điểm</th>
            <th className="hidden md:table-cell px-4 md:px-6 py-3 text-right text-sm font-semibold">Bài Tập</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {leaderboard.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-4 md:px-6 py-4 text-sm font-semibold">
                #{index + 4}
              </td>
              <td className="px-4 md:px-6 py-4 text-sm">{user.name}</td>
              <td className="px-4 md:px-6 py-4 text-right text-sm font-bold">
                {user.points}
              </td>
              <td className="hidden md:table-cell px-4 md:px-6 py-4 text-right text-sm">
                {user.exercises}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </Container>
</div>
```

---

## 7. PROFILE PAGE

### Nâng cấp

#### Profile Layout
```tsx
// components/Profile.tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
  <Container>
    
    {/* Profile Header */}
    <Card className="p-6 md:p-8 mb-8">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full"
        />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {user.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {user.email}
          </p>
          <Button>Chỉnh Sửa Hồ Sơ</Button>
        </div>
      </div>
    </Card>

    {/* Stats Grid */}
    <Grid cols={{ mobile: 2, tablet: 4, desktop: 4 }} gap="md" className="mb-8">
      {stats.map((stat) => (
        <Card key={stat.id} className="p-4 md:p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            {stat.label}
          </p>
          <p className="text-2xl md:text-3xl font-bold">
            {stat.value}
          </p>
        </Card>
      ))}
    </Grid>

    {/* Content Grid */}
    <Grid cols={{ mobile: 1, tablet: 2, desktop: 2 }} gap="lg">
      
      {/* Learning Progress */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6">Tiến Độ Học Tập</h2>
        {/* Progress chart */}
      </Card>

      {/* Recent Activity */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-bold mb-6">Hoạt Động Gần Đây</h2>
        {/* Activity list */}
      </Card>
    </Grid>
  </Container>
</div>
```

---

## 8. TESTING CHECKLIST

### Mobile (320px - 480px)
- [ ] All text is readable without zooming
- [ ] Buttons are 44px+ height
- [ ] Forms are full width
- [ ] Images are properly sized
- [ ] No horizontal scroll
- [ ] Navigation is accessible

### Tablet (640px - 1024px)
- [ ] 2-column layouts work
- [ ] Sidebar collapses/expands
- [ ] Cards are properly sized
- [ ] Charts are readable

### Desktop (1024px+)
- [ ] 3-4 column layouts
- [ ] Sidebar is visible
- [ ] Content is properly centered
- [ ] Spacing is optimal

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Images are optimized
- [ ] No layout shifts

