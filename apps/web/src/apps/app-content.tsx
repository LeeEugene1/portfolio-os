import { CalculatorApp } from "./calculator/calculator-app";

export function PortfolioApp() {
  return (
    <div className="app-content portfolio-app">
      <p className="eyebrow">Featured portfolio</p>
      <h2>제품처럼 작동하는 포트폴리오</h2>
      <p>
        OS 데스크톱 안에서 프로젝트, 역할, 기술 선택, 문제 해결 과정을
        프로그램 창처럼 탐색할 수 있는 웹 포트폴리오입니다.
      </p>
      <div className="project-grid">
        <section>
          <h3>Portfolio OS</h3>
          <p>Next.js, React, TypeScript 기반의 반응형 데스크톱 UI.</p>
        </section>
        <section>
          <h3>Store MVP</h3>
          <p>정적 상품과 localStorage 장바구니로 구성할 미니 커머스 앱.</p>
        </section>
      </div>
    </div>
  );
}

export function StoreApp() {
  return (
    <div className="app-content">
      <p className="eyebrow">Store</p>
      <h2>Mini storefront</h2>
      <p>상품 목록과 장바구니 기능이 들어갈 쇼핑몰 프로그램입니다.</p>
      <ul className="compact-list">
        <li>정적 상품 데이터</li>
        <li>비회원 장바구니</li>
        <li>새로고침 후 상태 복원</li>
      </ul>
    </div>
  );
}

export function ResumeApp() {
  return (
    <div className="app-content">
      <p className="eyebrow">Resume</p>
      <h2>Resume entry</h2>
      <p>이력서 PDF 또는 문서로 이동하는 명확한 진입점을 제공합니다.</p>
      <a className="app-link" href="#resume">
        이력서 보기
      </a>
    </div>
  );
}

export function ContactApp() {
  return (
    <div className="app-content contact-app">
      <p className="eyebrow">Contact</p>
      <section className="contact-profile" aria-label="Contact profile">
        <div>
          <h2>이유진</h2>
          <p>프론트엔드개발자</p>
        </div>
      </section>
      <div className="contact-links" aria-label="Contact channels">
        <a className="contact-link" href="mailto:uwm1004@gmail.com">
          <span>Email</span>
          <strong>uwm1004@gmail.com</strong>
        </a>
        <a className="contact-link" href="tel:01056526287">
          <span>Phone</span>
          <strong>010 5652 6287</strong>
        </a>
        <a
          className="contact-link"
          href="https://github.com/LeeEugene1"
          rel="noreferrer"
          target="_blank"
        >
          <span>GitHub</span>
          <strong>github.com/LeeEugene1</strong>
        </a>
        <a
          className="contact-link"
          href="https://dubaiyu.tistory.com/"
          rel="noreferrer"
          target="_blank"
        >
          <span>Blog</span>
          <strong>dubaiyu.tistory.com</strong>
        </a>
      </div>
    </div>
  );
}

export { CalculatorApp };
