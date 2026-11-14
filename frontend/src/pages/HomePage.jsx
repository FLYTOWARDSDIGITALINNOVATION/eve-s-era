import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/landing-page/Hero";
import Collections from "../components/landing-page/Collections";
import CustomerFavourites from "../components/landing-page/CustomerFavourites";
import WhyChoose from "../components/landing-page/WhyChoose";
import FinalCallToAction from "../components/landing-page/FinalCallToAction";
import "./HomePage.css";

const HomePage = () => (
  <div className="homepage landing-homepage">
    <Header />
    <main className="landing-content">
      <Hero />
      <Collections />
      <CustomerFavourites />
      <WhyChoose />
      <FinalCallToAction />
    </main>
    <Footer />
  </div>
);

export default HomePage;
