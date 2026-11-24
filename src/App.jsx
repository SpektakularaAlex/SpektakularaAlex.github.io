import { useEffect, useState } from "react";
import * as content from "./content.jsx";

// Files in public/ (cv.pdf, photo.jpg, …). Relative, so they work under any base URL.
const file = (name) => "./" + name;

function Email({ address }) {
  // Plain text in the HTML, a mailto link once the page has loaded.
  const [href, setHref] = useState(null);
  useEffect(() => setHref("mailto:" + address.replace(" [at] ", "@")), [address]);
  return href ? <a href={href}>{address}</a> : address;
}

function Header({ name, tagline, email, cvUpdated, github, linkedin }) {
  return (
    <header className="intro">
      <div>
        <h1>{name}</h1>
        <p className="tagline">
          {tagline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <ul className="links">
          <li className="break">
            <Email address={email} />
          </li>
          <li>
            <a href={file("cv.pdf")} target="_blank" rel="noopener">CV</a>{" "}
            <span className="note">(Last updated: {cvUpdated})</span>
          </li>
          <li><a href={github} rel="me">GitHub</a></li>
          <li><a href={linkedin} rel="me">LinkedIn</a></li>
        </ul>
      </div>
      <picture>
        <source srcSet={file("photo.webp")} type="image/webp" />
        <img src={file("photo.jpg")} width="300" height="300" alt={`Portrait of ${name}`} />
      </picture>
    </header>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>{title}</h2>
      {children}
    </section>
  );
}

function News({ items }) {
  return (
    <ul className="news">
      {items.map(({ when, text }, i) => (
        <li key={i}>
          <span className="when">{when}</span>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

function Entries({ items }) {
  return (
    <ul className="entries">
      {items.map(({ title, when, where, text, links = [] }) => (
        <li key={title}>
          <div className="head">
            <h3>{title}</h3>
            {when && <span className="when">{when}</span>}
          </div>
          {where && <p className="where">{where}</p>}
          <p className="desc">
            {text}
            {links.map(({ label, url }) => (
              <span key={url}>
                {" "}
                <a href={url}>[{label}]</a>
              </span>
            ))}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const { profile, about, news, research, otherProjects, publications } = content;
  const { projects, teaching, awards, beyond } = content;
  return (
    <>
      <a className="skip" href="#about">Skip to content</a>
      <div className="page">
        <Header {...profile} />
        <main>
          <Section id="about" title="About"><p>{about}</p></Section>
          <Section id="news" title="News"><News items={news} /></Section>
          <Section id="research" title="Research">
            <Entries items={research} />
            {otherProjects.length > 0 && (
              <>
                <h3 className="subhead">Other projects</h3>
                <Entries items={otherProjects} />
              </>
            )}
          </Section>
          {publications.length > 0 && (
            <Section id="publications" title="Publications">
              <Entries items={publications} />
            </Section>
          )}
          <Section id="projects" title="Hackathons & projects"><Entries items={projects} /></Section>
          <Section id="teaching" title="Teaching"><Entries items={teaching} /></Section>
          <Section id="awards" title="Awards & service">
            <ul className="plain">
              {awards.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>
          <Section id="beyond" title="Beyond research"><p>{beyond}</p></Section>
        </main>
        <footer>
          <p>© 2026 {profile.name}</p>
        </footer>
      </div>
    </>
  );
}
