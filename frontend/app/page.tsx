"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Học viên");
  const [userEmail, setUserEmail] = useState("student@lhd.edu.vn");
  const [userAvatar, setUserAvatar] = useState(
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' width='64' height='64' shape-rendering='crispEdges'><rect width='64' height='64' fill='%23a4c68d'/><rect x='0' y='0' width='64' height='28' fill='%237ba36a'/><rect x='6' y='8' width='12' height='14' fill='%23507c43'/><rect x='46' y='10' width='14' height='12' fill='%23507c43'/><rect x='22' y='4' width='20' height='8' fill='%23669152'/><rect x='0' y='32' width='64' height='32' fill='%23c4936d'/><rect x='0' y='42' width='64' height='22' fill='%23b17c54'/><rect x='20' y='12' width='24' height='16' fill='%231e1e24'/><rect x='22' y='16' width='20' height='20' fill='%23fddbc3'/><rect x='24' y='34' width='16' height='4' fill='%23fbc5a3'/><rect x='18' y='10' width='28' height='8' fill='%2322242a'/><rect x='18' y='18' width='6' height='8' fill='%2322242a'/><rect x='40' y='18' width='6' height='8' fill='%2322242a'/><rect x='24' y='14' width='8' height='6' fill='%2330323a'/><rect x='34' y='14' width='8' height='5' fill='%2322242a'/><rect x='18' y='24' width='4' height='6' fill='%23fbc5a3'/><rect x='42' y='24' width='4' height='6' fill='%23fbc5a3'/><rect x='25' y='25' width='4' height='4' fill='%231e1e24'/><rect x='35' y='25' width='4' height='4' fill='%231e1e24'/><rect x='23' y='28' width='4' height='2' fill='%23f7a799'/><rect x='37' y='28' width='4' height='2' fill='%23f7a799'/><rect x='29' y='31' width='6' height='2' fill='%23d97d64'/><rect x='22' y='21' width='10' height='9' fill='none' stroke='%23111' stroke-width='2'/><rect x='32' y='21' width='10' height='9' fill='none' stroke='%23111' stroke-width='2'/><rect x='31' y='24' width='2' height='2' fill='%23111'/><rect x='24' y='22' width='2' height='2' fill='%23ffffff'/><rect x='34' y='22' width='2' height='2' fill='%23ffffff'/><rect x='16' y='38' width='32' height='26' fill='%232b2d35'/><rect x='28' y='38' width='8' height='8' fill='%23b91c1c'/><rect x='22' y='38' width='6' height='26' fill='%233a3d47'/><rect x='36' y='38' width='6' height='26' fill='%233a3d47'/><rect x='29' y='44' width='6' height='20' fill='%23dc2626'/><rect x='31' y='42' width='2' height='22' fill='%23991b1b'/></svg>"
  );

  // Dropdowns & Modals
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState("home");
  const [bellBadge, setBellBadge] = useState(0);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleCourseAccess = (url: string = "/student/courses") => {
    if (isLoggedIn) {
      router.push(url);
    } else {
      toast.info("Vui lòng đăng nhập để xem danh mục khóa học học viên!");
      setShowLoginModal(true);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    const name = loginEmail.split("@")[0];
    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(loginEmail);
    localStorage.setItem("auth_token", "mock_token_" + Date.now());
    localStorage.setItem("lhd_learning_logged_in", "true");
    localStorage.setItem(
      "user_info",
      JSON.stringify({ name, email: loginEmail, role: "ROLE_STUDENT" })
    );
    setShowLoginModal(false);
    toast.success(`Chào mừng ${name} đã đăng nhập thành công! Đang chuyển tới danh mục khóa học...`);
    setTimeout(() => {
      router.push("/student/courses");
    }, 600);
  };

  // Chat Support State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: number; sender: "admin" | "user"; text: string; time: string }>
  >([
    {
      id: 1,
      sender: "admin",
      text: "Tôi là Chuyên viên tư vấn & hỗ trợ kỹ thuật của LHD – Learning. Bạn đang cần hỗ trợ vấn đề gì về khóa học hay tài khoản?",
      time: "22:20",
    },
  ]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync user from localStorage on mount
  useEffect(() => {
    try {
      const token =
        localStorage.getItem("auth_token") ||
        sessionStorage.getItem("auth_token");
      const savedUser =
        localStorage.getItem("user_info") ||
        localStorage.getItem("lhd_user_session") ||
        localStorage.getItem("user");

      if (token || savedUser) {
        setIsLoggedIn(true);
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.email) setUserEmail(parsed.email);
        }
      }

      const savedAvatar = localStorage.getItem("lhd_user_avatar");
      if (savedAvatar) setUserAvatar(savedAvatar);
    } catch {
      // ignore JSON parse errors
    }
  }, []);

  useEffect(() => {
    if (showChatModal) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, showChatModal]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#headerBellBtn") && !target.closest("#bellDropdown")) {
        setShowBellDropdown(false);
      }
      if (!target.closest("#headerMenuBtn") && !target.closest("#menuDropdown")) {
        setShowMenuDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // ScrollSpy listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const aboutSection = document.getElementById("about");
      const footerSection = document.getElementById("footer");

      if (!aboutSection || !footerSection) return;

      const aboutTop = aboutSection.offsetTop - 120;
      const aboutBottom = aboutTop + aboutSection.offsetHeight;
      const footerTop = footerSection.offsetTop - 250;

      if (
        scrollPos >= footerTop ||
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 60
      ) {
        setActiveMenu("footer");
      } else if (scrollPos >= aboutTop && scrollPos < aboutBottom) {
        setActiveMenu("about");
      } else {
        setActiveMenu("home");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    if (sectionId === "home") {
      e.preventDefault();
      setActiveMenu("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      e.preventDefault();
      setActiveMenu(sectionId);
      const target = document.getElementById(sectionId);
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 85;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    sessionStorage.clear();
    setIsLoggedIn(false);
    setShowMenuDropdown(false);
    toast.info("Đã đăng xuất tài khoản");
  };

  const handleSendChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      sender: "user" as const,
      text: trimmed,
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      const adminMsg = {
        id: Date.now() + 1,
        sender: "admin" as const,
        text: `Cảm ơn câu hỏi của ${userName}: "${trimmed}". Đội ngũ kỹ thuật viên và giảng viên của LHD đã tiếp nhận yêu cầu và sẽ hỗ trợ trực tiếp cho bạn ngay sau giây lát!`,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, adminMsg]);
    }, 800);
  };

  return (
    <>
      {/* Liquid Pastel Background Blobs */}
      <div className="liquid-blob blob-rose"></div>
      <div className="liquid-blob blob-lavender"></div>
      <div className="liquid-blob blob-mint"></div>

      {/* Header Navbar */}
      <header>
        <div className="header-left">
          <Link href="/" className="brand-logo">
            <div className="brand-icon">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <span className="brand-title">LHD – Learning</span>
          </Link>

          <ul className="nav-links">
            <li>
              <a
                href="/"
                className={activeMenu === "home" ? "nav-item-active" : ""}
                onClick={(e) => handleScrollTo(e, "home")}
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="/student/courses"
                onClick={(e) => {
                  e.preventDefault();
                  handleCourseAccess("/student/courses");
                }}
              >
                Khóa học
              </a>
            </li>
            <li>
              <a
                href="#about"
                className={activeMenu === "about" ? "nav-item-active" : ""}
                onClick={(e) => handleScrollTo(e, "about")}
              >
                Giới thiệu
              </a>
            </li>
            <li>
              <a
                href="#footer"
                className={activeMenu === "footer" ? "nav-item-active" : ""}
                onClick={(e) => handleScrollTo(e, "footer")}
              >
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        <div className="header-right">
          {/* Guest State */}
          {!isLoggedIn ? (
            <div className="nav-actions-guest" style={{ display: "inline-flex" }}>
              <button
                type="button"
                className="btn-guest-login"
                onClick={() => setShowLoginModal(true)}
              >
                <i className="fa-regular fa-user"></i>
                <span>Đăng nhập</span>
              </button>
              <button
                type="button"
                className="btn-guest-register"
                onClick={() => setShowLoginModal(true)}
              >
                <span>Đăng ký</span>
              </button>
            </div>
          ) : (
            /* Logged-in State */
            <div className="nav-actions-user" style={{ display: "inline-flex" }}>
              <div className="nav-user-left-group">
                {/* 1. Bell Button */}
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="nav-circle-btn btn-bell"
                    id="headerBellBtn"
                    title="Thông báo hệ thống"
                    onClick={() => setShowBellDropdown(!showBellDropdown)}
                  >
                    <i className="fa-regular fa-bell"></i>
                    {bellBadge > 0 && (
                      <span className="bell-badge">{bellBadge}</span>
                    )}
                  </button>

                  {/* Bell Dropdown */}
                  {showBellDropdown && (
                    <div
                      className="nav-dropdown"
                      id="bellDropdown"
                      style={{
                        minWidth: "320px",
                        left: 0,
                        right: "auto",
                        display: "block",
                      }}
                    >
                      <div
                        className="dropdown-header"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div className="dropdown-header-title">Thông báo mới</div>
                        <button
                          type="button"
                          onClick={() => {
                            setBellBadge(0);
                            toast.success("Đã đánh dấu đọc tất cả thông báo");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#0b63e5",
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Đã đọc tất cả
                        </button>
                      </div>
                      <div
                        style={{
                          padding: "0.65rem 0.85rem",
                          borderRadius: "12px",
                          background: "#f8fafc",
                          marginBottom: "6px",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            color: "#0f172a",
                            marginBottom: "3px",
                          }}
                        >
                          🇬🇧 Lớp học Live sắp bắt đầu
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#475569",
                            lineHeight: "1.4",
                          }}
                        >
                          Buổi tương tác phản xạ Tiếng Anh cùng Cô Emily Watson sẽ
                          mở lúc 20:00.
                        </div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "#94a3b8",
                            marginTop: "4px",
                          }}
                        >
                          15 phút trước
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "0.65rem 0.85rem",
                          borderRadius: "12px",
                          background: "#f8fafc",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: "0.85rem",
                            color: "#0f172a",
                            marginBottom: "3px",
                          }}
                        >
                          🇯🇵 Kết quả bài test từ vựng N5
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#475569",
                            lineHeight: "1.4",
                          }}
                        >
                          Điểm số của bạn: 95/100. Đủ điều kiện chuyển sang giai
                          đoạn N4.
                        </div>
                        <div
                          style={{
                            fontSize: "0.72rem",
                            color: "#94a3b8",
                            marginTop: "4px",
                          }}
                        >
                          2 giờ trước
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Shopping Cart Button */}
                <Link
                  href="/student/cart"
                  className="nav-circle-btn btn-cart"
                  title="Giỏ hàng khóa học"
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                </Link>
              </div>

              {/* Divider */}
              <div className="nav-user-divider"></div>

              {/* User Group */}
              <div className="nav-user-right-group">
                <Link
                  href="/student/profile"
                  className="user-capsule"
                  title="Xem trang thông tin cá nhân học viên"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={userAvatar}
                    className="user-capsule-avatar"
                    alt="Avatar"
                  />
                  <span className="user-capsule-name">{userName}</span>
                </Link>

                {/* Menu Button (3 bars) */}
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    className="nav-circle-btn btn-menu"
                    id="headerMenuBtn"
                    title="Menu quản lý học viên (☰)"
                    onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  >
                    <i className="fa-solid fa-bars"></i>
                  </button>

                  {/* Mega Dropdown */}
                  {showMenuDropdown && (
                    <div
                      className="nav-dropdown student-mega-dropdown"
                      id="menuDropdown"
                      style={{ right: 0, left: "auto", display: "block" }}
                    >
                      <div className="menu-user-banner">
                        <div className="menu-user-banner-glow"></div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={userAvatar}
                          className="menu-banner-avatar"
                          alt="Avatar"
                        />
                        <div className="menu-banner-meta">
                          <div className="menu-banner-name">{userName}</div>
                          <div className="menu-banner-sub">{userEmail}</div>
                          <div className="menu-banner-verified">
                            <i className="fa-solid fa-circle-check"></i>
                            <span>Thành viên / Đã xác thực</span>
                          </div>
                        </div>
                      </div>

                      {/* Quản lý Học tập */}
                      <div className="menu-group-heading">Quản lý Học tập</div>
                      <Link href="/student/home" className="student-menu-item">
                        <div className="menu-item-icon">
                          <i className="fa-solid fa-house"></i>
                        </div>
                        <span className="menu-item-title">
                          Trang chủ học viên
                        </span>
                      </Link>

                      <Link
                        href="/student/my-courses"
                        className="student-menu-item"
                      >
                        <div className="menu-item-icon">
                          <i className="fa-solid fa-book-bookmark"></i>
                        </div>
                        <span className="menu-item-title">
                          Khóa học của tôi
                        </span>
                      </Link>

                      <Link href="/courses" className="student-menu-item">
                        <div className="menu-item-icon">
                          <i className="fa-solid fa-compass"></i>
                        </div>
                        <span className="menu-item-title">
                          Khám phá khóa học
                        </span>
                      </Link>

                      <Link
                        href="/student/certificates"
                        className="student-menu-item"
                      >
                        <div className="menu-item-icon">
                          <i className="fa-solid fa-award"></i>
                        </div>
                        <span className="menu-item-title">
                          Chứng chỉ đạt được
                        </span>
                      </Link>

                      <Link
                        href="/student/profile#orders"
                        className="student-menu-item"
                      >
                        <div className="menu-item-icon">
                          <i className="fa-solid fa-receipt"></i>
                        </div>
                        <span className="menu-item-title">
                          Lịch sử giao dịch
                        </span>
                      </Link>

                      <div className="dropdown-divider"></div>

                      {/* Cài đặt & Hỗ trợ */}
                      <div className="menu-group-heading">
                        Cài đặt & Hỗ trợ
                      </div>
                      <Link
                        href="/student/profile"
                        className="student-menu-item"
                      >
                        <div className="menu-item-icon">
                          <i className="fa-solid fa-user-gear"></i>
                        </div>
                        <span className="menu-item-title">
                          Thông tin cá nhân
                        </span>
                      </Link>

                      <Link
                        href="/student/profile#security"
                        className="student-menu-item"
                      >
                        <div className="menu-item-icon">
                          <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <span className="menu-item-title">
                          Đổi mật khẩu / Bảo mật
                        </span>
                      </Link>

                      <button
                        type="button"
                        className="student-menu-item"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          background: "none",
                          border: "none",
                        }}
                        onClick={() => {
                          setShowMenuDropdown(false);
                          setShowChatModal(true);
                        }}
                      >
                        <div className="menu-item-icon">
                          <i className="fa-solid fa-headset"></i>
                        </div>
                        <span className="menu-item-title">
                          Hỗ trợ & Phản hồi
                        </span>
                      </button>

                      <div className="dropdown-divider"></div>

                      {/* Đăng xuất */}
                      <div style={{ paddingTop: "4px" }}>
                        <button
                          type="button"
                          className="btn-menu-logout"
                          onClick={handleLogout}
                        >
                          <i className="fa-solid fa-right-from-bracket"></i>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <div className="hero-badge">
            <i className="fa-solid fa-sparkles"></i>
            <span>Nền tảng học trực tuyến LHD – Learning</span>
          </div>
          <h1 className="hero-title">
            Chinh phục <span>Tiếng Anh & Tiếng Nhật</span> Tự Nhiên
          </h1>
          <p className="hero-desc">
            Phương pháp học tương tác trực quan với lộ trình cá nhân hóa, video
            giảng dạy chất lượng cao, bài tập trắc nghiệm và phòng học Live tương
            tác trực tiếp cùng giảng viên.
          </p>
          <div className="hero-btns">
            <button
              type="button"
              onClick={() => handleCourseAccess("/student/courses")}
              className="btn-hero-primary"
              style={{ border: "none", cursor: "pointer" }}
            >
              <span>BẮT ĐẦU HỌC NGAY</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            {!isLoggedIn && (
              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => setShowLoginModal(true)}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span>Tạo tài khoản miễn phí</span>
              </button>
            )}
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-glass">
            <h3
              style={{
                fontWeight: 800,
                fontSize: "1.25rem",
                color: "var(--text-main)",
              }}
            >
              Chọn ngôn ngữ bạn muốn học:
            </h3>
            <div className="language-selection-grid">
              <div
                className="lang-card"
                style={{ cursor: "pointer" }}
                onClick={() => handleCourseAccess("/student/courses?lang=en")}
              >
                <div className="lang-flag">🇬🇧</div>
                <div className="lang-name">Tiếng Anh</div>
                <div className="lang-count">
                  48+ Khóa học • IELTS / Communication
                </div>
              </div>
              <div
                className="lang-card"
                style={{ cursor: "pointer" }}
                onClick={() => handleCourseAccess("/student/courses?lang=jp")}
              >
                <div className="lang-flag">🇯🇵</div>
                <div className="lang-name">Tiếng Nhật</div>
                <div className="lang-count">36+ Khóa học • JLPT N5 -&gt; N1</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="section-container">
        <div className="section-header">
          <span className="section-tag">Khóa Học Nổi Bật</span>
          <h2 className="section-title">
            Lộ Trình Học Chuyên Sâu Cùng Giảng Viên Đỉnh Cao
          </h2>
        </div>

        <div className="courses-grid">
          {/* Course 1 */}
          <div className="course-card">
            <div
              className="course-thumb"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=60')",
              }}
            >
              <span className="course-badge-lang">🇬🇧 Tiếng Anh</span>
            </div>
            <div className="course-content">
              <div className="course-meta">
                <span>Sơ cấp -&gt; Trung cấp</span>
                <div className="course-rating">
                  <i className="fa-solid fa-star"></i> 4.9 (1,240)
                </div>
              </div>
              <h3 className="course-title">
                Tiếng Anh Giao Tiếp Siêu Phản Xạ Cùng Người Bản Xứ
              </h3>
              <div className="course-instructor">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
                  alt="Avatar"
                />
                <span>Cô Emily Watson (IELTS 8.5)</span>
              </div>
              <div className="course-footer">
                <div className="course-price">1,290,000đ</div>
                <button
                  type="button"
                  onClick={() => handleCourseAccess("/student/courses")}
                  className="btn-add-cart"
                  style={{ border: "none", cursor: "pointer" }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Course 2 */}
          <div className="course-card">
            <div
              className="course-thumb"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1528164344705-47542687990d?w=600&auto=format&fit=crop&q=60')",
              }}
            >
              <span className="course-badge-lang">🇯🇵 Tiếng Nhật</span>
            </div>
            <div className="course-content">
              <div className="course-meta">
                <span>JLPT N5 -&gt; N4</span>
                <div className="course-rating">
                  <i className="fa-solid fa-star"></i> 5.0 (890)
                </div>
              </div>
              <h3 className="course-title">
                Chinh Phục N5 - N4 Tiếng Nhật Cấp Tốc Cho Người Mới
              </h3>
              <div className="course-instructor">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60"
                  alt="Avatar"
                />
                <span>Thầy Kenji Tanaka</span>
              </div>
              <div className="course-footer">
                <div className="course-price">1,450,000đ</div>
                <button
                  type="button"
                  onClick={() => handleCourseAccess("/student/courses")}
                  className="btn-add-cart"
                  style={{ border: "none", cursor: "pointer" }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Course 3 */}
          <div className="course-card">
            <div
              className="course-thumb"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60')",
              }}
            >
              <span className="course-badge-lang">🇬🇧 Tiếng Anh</span>
            </div>
            <div className="course-content">
              <div className="course-meta">
                <span>IELTS Academic</span>
                <div className="course-rating">
                  <i className="fa-solid fa-star"></i> 4.8 (950)
                </div>
              </div>
              <h3 className="course-title">
                Bứt Phá IELTS Writing &amp; Speaking Band 7.0+
              </h3>
              <div className="course-instructor">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60"
                  alt="Avatar"
                />
                <span>Thầy David Miller</span>
              </div>
              <div className="course-footer">
                <div className="course-price">1,890,000đ</div>
                <button
                  type="button"
                  onClick={() => handleCourseAccess("/student/courses")}
                  className="btn-add-cart"
                  style={{ border: "none", cursor: "pointer" }}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-header">
          <span className="about-quote-tag">
            <i className="fa-solid fa-sparkles"></i>
            <span>Về LHD – Learning</span>
          </span>
          <h2 className="section-title">
            Hành Trình Khơi Mở Tiềm Năng Ngôn Ngữ Vô Tận
          </h2>
          <p
            style={{
              color: "var(--text-sub)",
              maxWidth: "760px",
              margin: "1rem auto 0",
              fontSize: "1.05rem",
              lineHeight: 1.7,
            }}
          >
            Được sáng lập với sứ mệnh xóa bỏ rào cản ngoại ngữ, LHD – Learning
            mang đến giải pháp học trực tuyến toàn diện: từ kiến thức học thuật
            chuẩn quốc tế đến kỹ năng phản xạ thực chiến tự nhiên nhất.
          </p>
        </div>

        {/* Hero Story & Highlight Box */}
        <div className="about-hero-box">
          <div>
            <div
              className="about-quote-tag"
              style={{
                background: "rgba(11, 99, 229, 0.08)",
                color: "#0b63e5",
              }}
            >
              <i className="fa-solid fa-compass"></i>
              <span>Phương Pháp Đào Tạo Tiên Phong</span>
            </div>
            <h3 className="about-headline">
              Học ngoại ngữ theo cách <span>bản năng của não bộ</span>, không ghi
              nhớ máy móc
            </h3>
            <p className="about-lead-text">
              Tại LHD – Learning, mỗi buổi học là một trải nghiệm thực tế với mô
              hình tương tác đa giác quan. Người học được đắm mình vào ngữ cảnh
              văn hóa, thảo luận cùng giảng viên bản xứ và nhận phản hồi chỉnh sửa
              ngữ điệu tức thời.
            </p>
            <ul className="about-checklist">
              <li className="about-check-item">
                <span className="about-check-icon">
                  <i className="fa-solid fa-check"></i>
                </span>
                <span>
                  Lộ trình cá nhân hóa đo lường chính xác theo chuẩn khung tham
                  chiếu CEFR &amp; JLPT.
                </span>
              </li>
              <li className="about-check-item">
                <span className="about-check-icon">
                  <i className="fa-solid fa-check"></i>
                </span>
                <span>
                  Lớp học Live nhóm nhỏ tối đa 6 học viên, đảm bảo thời lượng thực
                  hành phản xạ trên 70%.
                </span>
              </li>
              <li className="about-check-item">
                <span className="about-check-icon">
                  <i className="fa-solid fa-check"></i>
                </span>
                <span>
                  Kho tài liệu số hóa không giới hạn cùng hệ thống bài tập luyện
                  phát âm thông minh.
                </span>
              </li>
            </ul>
          </div>

          {/* Stats Grid */}
          <div className="about-stats-grid">
            <div className="about-stat-card">
              <div className="about-stat-num">98.8%</div>
              <div className="about-stat-desc">
                Học viên đạt chứng chỉ mục tiêu ngay lần thi đầu
              </div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-num">15,000+</div>
              <div className="about-stat-desc">
                Học viên tin tưởng đồng hành và bứt phá thành công
              </div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-num">50,000+</div>
              <div className="about-stat-desc">
                Giờ học Live tương tác trực tiếp chất lượng cao
              </div>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-num">4.9/5.0★</div>
              <div className="about-stat-desc">
                Điểm số hài lòng tuyệt đối từ cộng đồng học viên
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="pillars-grid">
          {/* Pillar 1 */}
          <div className="pillar-card">
            <div className="pillar-header">
              <div className="pillar-icon-box pillar-icon-blue">
                <i className="fa-solid fa-brain"></i>
              </div>
              <span className="pillar-tag">Độc Quyền LHD</span>
            </div>
            <h4 className="pillar-title">Phương Pháp Aura Morph</h4>
            <p className="pillar-desc">
              Kích hoạt khả năng tiếp thu ngôn ngữ tự nhiên thông qua ngữ cảnh đa
              phương tiện, giúp não bộ hình thành liên kết từ vựng sâu sắc và
              phản xạ nói không cần dịch nhẩm.
            </p>
            <div className="pillar-badges">
              <span className="pillar-badge-item">Phản xạ tự nhiên</span>
              <span className="pillar-badge-item">Ghi nhớ tiềm thức</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="pillar-card">
            <div className="pillar-header">
              <div className="pillar-icon-box pillar-icon-green">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
              <span className="pillar-tag">Top 5% Tuyển Chọn</span>
            </div>
            <h4 className="pillar-title">Giảng Viên Chuyên Nghiệp</h4>
            <p className="pillar-desc">
              100% đội ngũ giảng viên và cố vấn sở hữu chứng chỉ quốc tế IELTS
              8.0+ / JLPT N1, được đào tạo bài bản về kỹ năng sư phạm hiện đại và
              truyền cảm hứng học tập mạnh mẽ.
            </p>
            <div className="pillar-badges">
              <span className="pillar-badge-item">IELTS 8.0+ / JLPT N1</span>
              <span className="pillar-badge-item">Sửa lỗi phát âm 1:1</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="pillar-card">
            <div className="pillar-header">
              <div className="pillar-icon-box pillar-icon-purple">
                <i className="fa-solid fa-headset"></i>
              </div>
              <span className="pillar-tag">Thời Gian Thực</span>
            </div>
            <h4 className="pillar-title">Lớp Live Đa Chiều 24/7</h4>
            <p className="pillar-desc">
              Phòng học tương tác trực tuyến với công nghệ âm thanh chuẩn phòng
              thu, bảng viết số hóa và các bài tập trắc nghiệm nhanh, mang lại cảm
              giác chân thực như tại lớp học offline.
            </p>
            <div className="pillar-badges">
              <span className="pillar-badge-item">Tương tác trực tiếp</span>
              <span className="pillar-badge-item">Lịch học linh hoạt</span>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="pillar-card">
            <div className="pillar-header">
              <div className="pillar-icon-box pillar-icon-amber">
                <i className="fa-solid fa-certificate"></i>
              </div>
              <span className="pillar-tag">Bảo Mật QR Code</span>
            </div>
            <h4 className="pillar-title">Chứng Chỉ Số Chuẩn Hóa</h4>
            <p className="pillar-desc">
              Cấp chứng chỉ điện tử có mã định danh QR chống giả mạo ngay sau khi
              hoàn thành khóa học, được đối tác học thuật công nhận và dễ dàng
              thêm vào hồ sơ năng lực LinkedIn.
            </p>
            <div className="pillar-badges">
              <span className="pillar-badge-item">Chuẩn CEFR &amp; JLPT</span>
              <span className="pillar-badge-item">Định danh điện tử</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="about-cta-banner">
          <div>
            <h3 className="about-cta-title">
              Sẵn sàng bứt phá trình độ ngoại ngữ của bạn?
            </h3>
            <p className="about-cta-desc">
              Tham gia cùng hơn 15,000 học viên tại LHD – Learning để mở ra cánh
              cửa học tập và sự nghiệp toàn cầu.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCourseAccess("/student/courses")}
            className="btn-about-cta"
            style={{ border: "none", cursor: "pointer" }}
          >
            <span>Khám phá các khóa học</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer">
        <div className="footer-grid">
          <div>
            <Link
              href="/"
              className="brand-logo"
              style={{ marginBottom: "1rem" }}
            >
              <div className="brand-icon">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <span className="brand-title">LHD – Learning</span>
            </Link>
            <p className="footer-desc">
              Hệ sinh thái đào tạo trực tuyến LHD – Learning áp dụng công nghệ
              E-Learning LMS hiện đại, mang đến trải nghiệm học tập chuẩn quốc
              tế, tự nhiên và bứt phá.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Khám Phá</h4>
            <ul className="footer-links">
              <li>
                <a
                  href="/student/courses?lang=en"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCourseAccess("/student/courses?lang=en");
                  }}
                >
                  Tiếng Anh Giao Tiếp
                </a>
              </li>
              <li>
                <a
                  href="/student/courses?lang=jp"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCourseAccess("/student/courses?lang=jp");
                  }}
                >
                  Tiếng Nhật JLPT
                </a>
              </li>
              <li>
                <a
                  href="/student/courses"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCourseAccess("/student/courses");
                  }}
                >
                  Tất cả khóa học
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleScrollTo(e, "about")}>
                  Về LHD – Learning
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Học Viên</h4>
            <ul className="footer-links">
              <li>
                <Link href="/student/home">Không gian học viên</Link>
              </li>
              <li>
                <Link href="/student/my-courses">Khóa học của tôi</Link>
              </li>
              <li>
                <Link href="/student/certificates">Chứng chỉ hoàn thành</Link>
              </li>
              <li>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                  onClick={() => setShowChatModal(true)}
                >
                  Hỗ trợ kỹ thuật
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Hệ Thống</h4>
            <ul className="footer-links">
              <li>
                <Link href="/instructor/dashboard">Kênh Giảng Viên</Link>
              </li>
              <li>
                <Link href="/admin/dashboard">Quản Trị Hệ Thống</Link>
              </li>
              <li>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                  onClick={() => setShowLoginModal(true)}
                >
                  Đăng Nhập Tài Khoản
                </button>
              </li>
              <li>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    padding: 0,
                    font: "inherit",
                  }}
                  onClick={() => setShowLoginModal(true)}
                >
                  Đăng Ký Thành Viên
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 LHD – Learning Platform. All rights reserved.</span>
          <span>Liên hệ hỗ trợ: support@lhd.edu.vn</span>
        </div>
      </footer>

      {/* Quick Login Modal */}
      {showLoginModal && (
        <div
          className="modal-overlay"
          id="loginModalOverlay"
          style={{ display: "flex" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLoginModal(false);
          }}
        >
          <div className="login-modal-box">
            <div className="modal-header">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  className="brand-icon"
                  style={{
                    width: "36px",
                    height: "36px",
                    fontSize: "1rem",
                  }}
                >
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    color: "#0f172a",
                  }}
                >
                  Đăng nhập LHD – Learning
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                title="Đóng"
                onClick={() => setShowLoginModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: "0.9rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "5px",
                  }}
                >
                  Email đăng nhập
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="student@lhd.edu.vn"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "14px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#334155",
                    marginBottom: "5px",
                  }}
                >
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Mật khẩu"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "14px",
                    border: "1.5px solid #cbd5e1",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  background: "#0b63e5",
                  color: "white",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(11, 99, 229, 0.3)",
                  transition: "all 0.2s ease",
                }}
              >
                Đăng Nhập Vào Hệ Thống
              </button>
            </form>

            <div
              style={{
                textAlign: "center",
                marginTop: "1.25rem",
                fontSize: "0.85rem",
                color: "#64748b",
              }}
            >
              Chưa có tài khoản?{" "}
              <button
                type="button"
                style={{
                  color: "#0b63e5",
                  fontWeight: 700,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  toast.info("Đang chuyển tới trang đăng ký");
                }}
              >
                Đăng ký miễn phí
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Live Support Chat Modal */}
      {showChatModal && (
        <div
          className="chat-modal-overlay"
          id="adminChatModal"
          style={{ display: "flex" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowChatModal(false);
          }}
        >
          <div className="chat-modal-window">
            {/* Header */}
            <div className="chat-modal-header">
              <div className="chat-admin-info">
                <div className="chat-admin-avatar-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                    alt="Admin LHD"
                    className="chat-admin-avatar"
                  />
                  <span className="chat-online-badge"></span>
                </div>
                <div>
                  <div className="chat-admin-name">
                    Hỗ Trợ Học Viên – LHD Admin
                  </div>
                  <div className="chat-admin-status">
                    Trực tuyến 24/7 • Phản hồi ngay
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-close-chat"
                title="Đóng hộp thoại"
                onClick={() => setShowChatModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Messages Body */}
            <div className="chat-modal-body" id="chatMessagesContainer">
              <div className="chat-timestamp-divider">Hôm nay, 22:20</div>

              {/* Message History */}
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-msg-row ${
                    msg.sender === "admin" ? "admin-row" : "user-row"
                  }`}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {msg.sender === "admin" && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                      className="chat-bubble-avatar"
                      alt="Admin"
                    />
                  )}
                  <div
                    className={`chat-bubble ${
                      msg.sender === "admin" ? "admin-bubble" : "user-bubble"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        opacity: 0.7,
                        marginTop: "4px",
                        textAlign: msg.sender === "user" ? "right" : "left",
                      }}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {/* Quick Options */}
              <div className="chat-quick-options" id="chatQuickOptions">
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() =>
                    handleSendChat("Cách tham gia phòng học Live Google Meet?")
                  }
                >
                  🎥 Vào phòng học Live
                </button>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() =>
                    handleSendChat("Kiểm tra trạng thái thanh toán VNPay")
                  }
                >
                  💳 Kiểm tra đơn hàng VNPay
                </button>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() =>
                    handleSendChat(
                      "Hướng dẫn tải chứng chỉ PDF có chữ ký số"
                    )
                  }
                >
                  📜 Cấp chứng chỉ khóa học
                </button>
                <button
                  type="button"
                  className="quick-chip"
                  onClick={() =>
                    handleSendChat("Tôi muốn phản hồi về nội dung bài giảng")
                  }
                >
                  💡 Góp ý / Phản hồi
                </button>
              </div>

              <div ref={chatBottomRef} />
            </div>

            {/* Input Footer */}
            <div className="chat-modal-footer">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat(chatInput);
                }}
                style={{ display: "flex", gap: "8px", width: "100%" }}
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Nhập câu hỏi hoặc phản hồi của bạn..."
                  className="chat-input-field"
                  autoComplete="off"
                  required
                />
                <button
                  type="submit"
                  className="btn-chat-send"
                  title="Gửi tin nhắn"
                >
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
