import React from 'react';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import CoreValues from './components/CoreValues';
import LatestPosts from './components/LatestPosts';
import UsefulServices from './components/UsefulServices';
import PartnershipPrograms from './components/PartnershipPrograms';
import Vacancies from './components/Vacancies';
import ContactForm from './components/ContactForm';
import { client } from './lib/graphql';
import { gql } from 'graphql-request';
import { Metadata } from 'next';
import { getBackendUrl } from '@/lib/auth-server';

type HomeQueryResponse = {
  Home?: {
    hero?: {
      title?: string | null;
      description?: string | null;
      valueProposition?: string | null;
      primaryButtonLink?: string | null;
      secondaryButtonLink?: string | null;
    } | null;
    whatWeDo?: {
      badgeText?: string | null;
      title?: string | null;
      description?: string | null;
      buttonLink?: string | null;
    } | null;
    coreValues?: {
      badgeText?: string | null;
      title?: string | null;
      cards?: {
        id?: string | null;
        title?: string | null;
        description?: string | null;
        icon?: {
          url?: string | null;
        } | null;
      }[] | null;
    } | null;
    seo?: {
      title?: string | null;
      description?: string | null;
      ogImage?: {
        url?: string | null;
      } | null;
    } | null;
  } | null;
};

const HOME_QUERY = gql`
  query {
    Home {
      hero {
        title
        description
        valueProposition
        primaryButtonLink
        secondaryButtonLink
      }
      whatWeDo {
        badgeText
        title
        description
        buttonLink
      }
      coreValues {
        badgeText
        title
        cards {
          id
          title
          description
          icon {
            url
          }
        }
      }
      seo {
        title
        description
        ogImage {
          url
        }
      }
    }
  }
`;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await client.request<HomeQueryResponse>(HOME_QUERY);
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
  const data = await client.request<HomeQueryResponse>(HOME_QUERY).catch(() => null);
  const hero = data?.Home?.hero;
  const whatWeDo = data?.Home?.whatWeDo;
  const coreValues = data?.Home?.coreValues;
  const backendUrl = getBackendUrl();

  return (
    <main className="flex flex-col w-full min-h-screen">
      <Hero data={hero} />
      <AboutUs data={whatWeDo} />
      <CoreValues data={coreValues} backendUrl={backendUrl} />
      <LatestPosts />
      <UsefulServices />
      <PartnershipPrograms />
      <Vacancies />
      <ContactForm />
    </main>
  );
};

export default Home;
