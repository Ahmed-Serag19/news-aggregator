const Footer = () => {
  return (
    <footer className="container mx-auto px-4 text-center text-md py-2 text-muted-foreground">
      © {new Date().getFullYear()} NewsAgg - All rights reserved
    </footer>
  );
};

export default Footer;
