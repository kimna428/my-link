import { useState } from "react";
import type { FormEvent } from "react";

type LinkItem = {
  id: string;
  title: string;
  url: string;
};

const initialLinks: LinkItem[] = [
  {
    id: "github",
    title: "GitHub",
    url: "https://github.com/kimna428",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    url: "https://github.com/kimna428/my-link",
  },
  {
    id: "blog",
    title: "Blog",
    url: "https://velog.io",
  },
];

const normalizeUrl = (url: string) => {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

function App() {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const addLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextTitle = title.trim();
    const nextUrl = url.trim();

    if (!nextTitle || !nextUrl) {
      return;
    }

    setLinks((currentLinks) => [
      ...currentLinks,
      {
        id: `${Date.now()}-${nextTitle}`,
        title: nextTitle,
        url: normalizeUrl(nextUrl),
      },
    ]);
    setTitle("");
    setUrl("");
  };

  return (
    <main className="app-shell">
      <section className="profile-panel" aria-label="마이링크 프로필">
        <div className="profile-avatar" aria-hidden="true">
          KN
        </div>
        <p className="profile-kicker">my-link</p>
        <h1>김나의 마이링크</h1>
        <p className="profile-bio">
          프로젝트, 코드, 글을 한곳에 모아 둔 개인 링크 페이지입니다.
        </p>
      </section>

      <section className="link-panel" aria-label="기본 링크 목록">
        <div className="section-heading">
          <h2>Links</h2>
        </div>

        <div className="link-list">
          {links.map((link) => (
            <a
              className="link-item"
              href={link.url}
              target="_blank"
              rel="noreferrer"
              key={link.id}
            >
              <span>{link.title}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

        <form className="add-link-form" onSubmit={addLink}>
          <div className="form-row">
            <label>
              <span>제목</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="예: Instagram"
              />
            </label>
            <label>
              <span>URL</span>
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="예: https://instagram.com/..."
              />
            </label>
          </div>
          <button type="submit">
            링크 추가
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
