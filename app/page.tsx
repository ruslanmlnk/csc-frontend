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
import { client } from './lib/graphql';
import { gql } from 'graphql-request';
import { Metadata } from 'next';

const HOME_QUERY = gql`
  query {
    Home {
      seo {
        title
        description
        ogImage {
          url
        }
      }
      sections {
        hero {
          badgeText
          title
          subtitle
          primaryButtonText
          secondaryButtonText
          backgroundImage {
            url
          }
          bottomGraphic {
            url
          }
        }
      }
    }
  }
`;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data: any = await client.request(HOME_QUERY);
    const seo = data?.Home?.seo;

    if (!seo) return { title: 'CSC Agency' };

    return {
      title: seo.title,
      description: seo.description,
      openGraph: {
        title: seo.title,
        description: seo.description,
        images: seo.ogImage?.url ? [{ url: seo.ogImage.url }] : [],
      },
    };
  } catch (error) {
    console.error('Error fetching SEO data:', error);
    return { title: 'CSC Agency' };
  }
}

const Home: React.FC = async () => {
  const data: any = await client.request(HOME_QUERY);
  const sections = data?.Home?.sections;

  return (
    <main className="flex flex-col w-full min-h-screen">
      <Header />
      <Hero data={sections?.hero} />
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