export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-3">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
          Built by{" "}
          <a
            href="https://udohjeremiah.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Udoh Jeremiah
          </a>
          . The source code is available on{" "}
          <a
            href="https://github.com/udohjeremiah/ecommerce-cms"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
