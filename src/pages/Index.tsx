import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Settings, Home, Grid3X3, GitBranch, Clock, BookOpen, Store, Fingerprint, ChevronLeft, ChevronRight } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "首页", active: true },
  { icon: Grid3X3, label: "应用" },
  { icon: GitBranch, label: "工作流" },
  { icon: Clock, label: "定时任务" },
  { icon: BookOpen, label: "知识库" },
  { icon: Store, label: "工作流市场" },
  { icon: Fingerprint, label: "指纹浏览器" },
];

const Index = () => {
  const { categories, tasks } = useData();
  const [inputValue, setInputValue] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Filter visible tasks and sort by order
  const visibleTasks = tasks
    .filter(task => task.isVisible)
    .sort((a, b) => a.order - b.order);

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  // Set default selected category
  useEffect(() => {
    if (sortedCategories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(sortedCategories[0].id);
    }
  }, [sortedCategories, selectedCategoryId]);

  // Get tasks for selected category
  const filteredTasks = visibleTasks.filter(
    task => task.categoryId === selectedCategoryId
  );

  // Check scroll state
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [sortedCategories]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const handleTaskClick = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/20">
      {/* 左侧导航栏 */}
      <aside className="w-16 bg-[#1a1f36] flex flex-col items-center py-4 shrink-0">
        {/* Logo */}
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
          <span className="text-white font-bold text-lg">C</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col items-center gap-1 w-full">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={cn(
                "w-full py-3 flex flex-col items-center gap-1 text-xs transition-colors",
                item.active
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center px-6 py-12 overflow-hidden">
        {/* 管理员入口 */}
        <Link
          to="/admin/login"
          className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/50"
        >
          <Settings className="h-4 w-4" />
          管理后台
        </Link>

        {/* CUA Logo */}
        <h1 className="text-5xl font-bold text-[#1a1f36] tracking-tight mb-12">
          CUA
        </h1>

        {/* 任务输入框 */}
        <div className="w-full max-w-2xl mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="描述您想要的自动化任务"
              className="w-full h-24 px-5 py-4 text-base resize-none focus:outline-none rounded-xl bg-transparent placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 分类横向列表 */}
        <div className="w-full max-w-2xl mb-6">
          <div className="relative flex items-center">
            {/* Left scroll button */}
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
            )}

            {/* Categories container */}
            <div
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-1 py-1 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {sortedCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0",
                    selectedCategoryId === category.id
                      ? "bg-[#1a1f36] text-white shadow-md"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Right scroll button */}
            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* 任务列表 */}
        <div className="w-full max-w-2xl flex-1 overflow-y-auto pb-8">
          {filteredTasks.length > 0 ? (
            <div className="flex flex-col gap-3 animate-in fade-in duration-300">
              {filteredTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task.prompt)}
                  className="group w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5 text-left transition-all duration-200 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5"
                >
                  <h3 className="text-base font-medium text-gray-800 group-hover:text-[#1a1f36] transition-colors">
                    {task.name}
                  </h3>
                  {/* Hover tooltip effect - optional description preview */}
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-200 overflow-hidden">
                    {task.prompt}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Grid3X3 className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm">该分类下暂无任务</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
