function App() {
  const links = [
    {
      title: "GitHub",
      url: "https://github.com/kimna428",
    },
    {
      title: "Instagram",
      url: "https://www.instagram.com/",
    },
    {
      title: "YouTube",
      url: "https://www.youtube.com/",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f7fb",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "24px",
          background: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1>My Link</h1>
        <p>김나영의 마이링크 페이지입니다.</p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          {links.map((link) => (
            <a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                background: "#111827",
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              {link.title}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
