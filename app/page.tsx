import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import CoreValues from './components/CoreValues';
import LatestPosts from './components/LatestPosts';
import UsefulServices from './components/UsefulServices';
import PartnershipPrograms from './components/PartnershipPrograms';
import Vacancies from './components/Vacancies';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

const Home: React.FC = () => {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <Header />
      <Hero />
      <AboutUs />
      <CoreValues />
      <LatestPosts />
      <UsefulServices />
      <PartnershipPrograms />
      <Vacancies />
      <ContactForm />
      <Footer />
    </main>
  );
};

export default Home;