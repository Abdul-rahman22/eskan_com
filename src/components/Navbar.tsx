import { Menu, Phone, Heart, User } from "lucide-react";
import logo from "../assets/logo1.png";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "الرئيسية" },
    { path: "/properties", label: "العقارات" },
    { path: "/about", label: "من نحن" },
    // { path: "/contact", label: "تواصل معنا" },
    // { path: "/admin", label: "لوحة التحكم" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src={logo}
              alt="Eskan Egypt Logo"
              className="h-11 w-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-primary">
                Eskan Egypt
              </span>
              <span className="text-xs text-muted-foreground">
                اسكان مصر
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button> */}
            <Button size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
              <span> تسجيل الدخول </span>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-lg font-medium transition-colors hover:text-primary p-3 rounded-lg ${
                      isActive(link.path)
                        ? "bg-accent text-primary"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="flex flex-col gap-2 mt-4">
                  {/* <Button variant="outline" className="w-full gap-2">
                    <Heart className="h-4 w-4" />
                    المفضلة
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <User className="h-4 w-4" />
                    حسابي
                  </Button> */}
                  <Button className="w-full gap-2">
                    <Phone className="h-4 w-4" />
                    اتصل بنا
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
