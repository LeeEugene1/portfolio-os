"use client";

import { useMemo, useState } from "react";
import { CalculatorApp } from "./calculator/calculator-app";

type PortfolioSection = {
  title: string;
  items: string[];
};

type PortfolioPart = {
  id: string;
  label: string;
  path: string;
  prompt: string;
  name: string;
  tagline: string;
  meta?: string;
  link?: {
    href: string;
    label: string;
  };
  sections: PortfolioSection[];
};

const portfolioParts: PortfolioPart[] = [
  {
    id: "whoami",
    label: "$ whoami",
    path: "~/portfolio",
    prompt: "whoami",
    name: "Eugene Lee",
    tagline: "Frontend Developer · 이커머스 · AI · 블록체인",
    sections: [
      {
        title: "Highlights",
        items: [
          "1인 프론트엔드 담당으로 이커머스 운영, 기획, 배포 전 과정 수행",
          "SEO Lighthouse 100 달성, CLS 0.6에서 0.1로 개선",
          "블록체인 지갑과 NFT 연동 기반 글로벌 P2E 게임 출시 경험",
        ],
      },
      {
        title: "Currently",
        items: [
          "Thirtymall 이커머스 프론트엔드 운영",
          "성능, 안정성, 사용자 경험을 데이터 기반으로 개선",
        ],
      },
    ],
  },
  {
    id: "thirtymall",
    label: "thirtymall",
    path: "~/portfolio/projects/thirtymall",
    prompt: "cat projects/thirtymall/README.md",
    name: "Thirtymall",
    tagline: "E-commerce",
    meta: "Frontend Sole Developer · React, TypeScript, Next.js, Material UI",
    link: { href: "https://thirtymall.com", label: "thirtymall.com" },
    sections: [
      {
        title: "Results",
        items: [
          "장바구니 응답 속도 1.5s에서 0.6s로 개선",
          "개인화 추천 영역 리뉴얼로 메인 페이지 클릭 수 10K 이상 증가",
          "외부 URL 접근과 새로고침 후에도 breadcrumb와 상품 그리드 상태 복원",
        ],
      },
      {
        title: "Reliability",
        items: [
          "로그인 실패 케이스를 수집, 분류하고 빈도 기반으로 대응",
          "OAuth state 파라미터 기반 리다이렉트 복구",
          "PC 결제 완료 후 팝업 자동 종료로 결제 인지 UX 개선",
        ],
      },
    ],
  },
  {
    id: "caveduck",
    label: "caveduck",
    path: "~/portfolio/projects/caveduck",
    prompt: "cat projects/caveduck/README.md",
    name: "Caveduck",
    tagline: "AI Character Chat Platform",
    meta: "Frontend Developer · Angular, JavaScript, Tailwind CSS, Node.js",
    link: { href: "https://caveduck.io/?locale=en", label: "caveduck.io" },
    sections: [
      {
        title: "Performance & SEO",
        items: [
          "SEO Lighthouse 100 달성, CLS 0.6에서 0.1로 개선",
          "S3 webp와 Cloudflare 캐시 기반 이미지 최적화",
          "Skeleton loader 도입으로 레이아웃 이동을 줄이고 체감 품질 개선",
        ],
      },
      {
        title: "Automation",
        items: [
          "NSFW 캐릭터 신고 카운트 기반 Public 노출 자동 제외",
          "Retool과 Slack 알림으로 관리자 신고 대응 자동화",
        ],
      },
    ],
  },
  {
    id: "sheepfarm",
    label: "sheepfarm",
    path: "~/portfolio/projects/sheepfarm",
    prompt: "cat projects/sheepfarm/README.md",
    name: "Sheepfarm",
    tagline: "Blockchain P2E Game",
    meta: "Frontend Developer · React, TypeScript, Web3",
    sections: [
      {
        title: "Launch",
        items: [
          "지갑 연결, NFT 보유 상태, 토큰 기반 게임 흐름을 프론트엔드에서 구현",
          "글로벌 사용자를 고려한 반응형 UI와 상태 안내를 구성",
        ],
      },
      {
        title: "Web3 UX",
        items: [
          "블록체인 트랜잭션의 대기, 성공, 실패 상태를 사용자 흐름에 맞춰 표현",
          "지갑 연결 오류와 네트워크 불일치 상황을 명확한 인터페이스로 안내",
        ],
      },
    ],
  },
  {
    id: "skills",
    label: "$ skills --list",
    path: "~/portfolio/skills",
    prompt: "skills --list",
    name: "Skills",
    tagline: "Frontend execution stack",
    sections: [
      {
        title: "Frontend",
        items: ["React", "Next.js", "TypeScript", "Angular", "Tailwind CSS"],
      },
      {
        title: "Product Quality",
        items: ["Performance tuning", "SEO", "WebView 대응", "A/B 개선", "운영 자동화"],
      },
    ],
  },
];

const resumeProjects = portfolioParts.filter((part) =>
  ["thirtymall", "caveduck", "sheepfarm"].includes(part.id),
);

export function PortfolioApp() {
  const [activePartId, setActivePartId] = useState(portfolioParts[0].id);
  const activeIndex = portfolioParts.findIndex((part) => part.id === activePartId);
  const activePart = portfolioParts[Math.max(0, activeIndex)];

  return (
    <div className="terminal-portfolio" aria-label="Terminal portfolio">
      <header className="terminal-header">
        <span className="terminal-dot terminal-dot-red" aria-hidden="true" />
        <span className="terminal-dot terminal-dot-yellow" aria-hidden="true" />
        <span className="terminal-dot terminal-dot-green" aria-hidden="true" />
        <span className="terminal-path">
          eugene@portfolio: <strong>{activePart.path}</strong>
        </span>
      </header>

      <nav className="terminal-tabs" aria-label="Portfolio parts">
        {portfolioParts.map((part, index) => (
          <button
            aria-pressed={part.id === activePart.id}
            className="terminal-tab"
            key={part.id}
            onClick={() => setActivePartId(part.id)}
            type="button"
          >
            <span>{index + 1}</span>
            {part.label}
          </button>
        ))}
      </nav>

      <article className="terminal-panel">
        <p className="terminal-prompt">$ {activePart.prompt}</p>
        <div className="terminal-title-row">
          <div>
            <h2>
              {activePart.name}
              {activePart.id === "whoami" ? (
                <span className="terminal-cursor" aria-hidden="true" />
              ) : null}
            </h2>
            <p>{activePart.tagline}</p>
            {activePart.meta ? <p className="terminal-meta">{activePart.meta}</p> : null}
          </div>
          {activePart.link ? (
            <a
              className="terminal-link"
              href={activePart.link.href}
              rel="noreferrer"
              target="_blank"
            >
              {activePart.link.label}
            </a>
          ) : null}
        </div>

        <div className="terminal-sections">
          {activePart.sections.map((section) => (
            <section className="terminal-section" key={section.title}>
              <h3>{section.title}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </article>

      <footer className="terminal-progress" aria-label="Portfolio progress">
        <span>
          Part {Math.max(0, activeIndex) + 1}/{portfolioParts.length}
        </span>
        <progress value={Math.max(0, activeIndex) + 1} max={portfolioParts.length} />
      </footer>
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
  const totalProjects = useMemo(() => resumeProjects.length, []);

  return (
    <article className="resume-document" aria-label="Resume document">
      <header className="resume-document-header">
        <div>
          <p className="eyebrow">Resume</p>
          <h2>Eugene Lee</h2>
          <p>Frontend Developer · 이커머스 · AI · 블록체인</p>
        </div>
        <div className="resume-actions">
          <a className="app-link" href="/resume-ko.pdf" target="_blank">
            PDF 보기
          </a>
          <a className="app-link" download href="/resume-ko.pdf">
            PDF 다운로드
          </a>
        </div>
      </header>

      <section className="resume-section">
        <h3>Summary</h3>
        <p>
          이커머스, AI, 블록체인 도메인에서 운영부터 신규 기능까지 책임지는
          end-to-end 경험을 쌓아온 프론트엔드 개발자입니다. 데이터를 기반으로
          성능과 UX를 개선하는 데 집중합니다.
        </p>
      </section>

      <section className="resume-section">
        <h3>Experience</h3>
        <div className="resume-timeline">
          {resumeProjects.map((project) => (
            <section key={project.id}>
              <h4>{project.name}</h4>
              <p>{project.meta}</p>
              <ul>
                {project.sections[0].items.slice(0, 2).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="resume-section">
        <h3>Skills</h3>
        <p>React, Next.js, TypeScript, Angular, performance tuning, SEO, WebView 대응</p>
      </section>

      <footer className="resume-footer">
        <span>{totalProjects} featured projects</span>
        <a href="mailto:uwm1004@gmail.com">uwm1004@gmail.com</a>
        <a href="https://github.com/LeeEugene1" rel="noreferrer" target="_blank">
          github.com/LeeEugene1
        </a>
      </footer>
    </article>
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
