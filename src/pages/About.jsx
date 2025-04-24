import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Link,
  Grid,
  Image,
  useBreakpointValue,
  Container,
  Button,
} from "@chakra-ui/react";
import { FaInstagram } from "react-icons/fa";
import LoadingSpinner from "../components/LoadingSpinner";
import { Helmet } from "react-helmet";

const TWICE_MEMBERS = [
  {
    name: "Twicetagram",
    instagram: "https://www.instagram.com/twicetagram/?hl=en",
    intagramUsername: "twicetagram",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/5e1048275ed84e22abb48b8f643419e6-TW-M14-Strategy-OnlineCover(1030).jpg",
  },
  {
    name: "Nayeon",
    instagram: "https://www.instagram.com/nayeonyny/",
    intagramUsername: "nayeonyny",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/8b99e15302844e749690c5ece02f7420-01_%E1%84%82%E1%85%A1%E1%84%8B%E1%85%A7%E1%86%AB_A_01.jpg",
  },
  {
    name: "Jeongyeon",
    instagram: "https://www.instagram.com/jy_piece/?hl=en",
    intagramUsername: "jy_piece",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/cdd8d7a6de27406d9767dfcc6dd0864e-02_%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%8B%E1%85%A7%E1%86%AB_A_01.jpg",
  },
  {
    name: "Momo",
    instagram: "https://www.instagram.com/momo/?hl=en",
    intagramUsername: "momo",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/5baae85ca0fb4bee912aea06645004b7-03_%E1%84%86%E1%85%A9%E1%84%86%E1%85%A9_A_01.jpg",
  },
  {
    name: "Sana",
    instagram: "https://www.instagram.com/m.by__sana/?hl=en",
    intagramUsername: "m.by__sana",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/818901a752764629b6cb7802266d6003-04_%E1%84%89%E1%85%A1%E1%84%82%E1%85%A1_A_02.jpg",
  },
  {
    name: "Jihyo",
    instagram: "https://www.instagram.com/_zyozyo/?hl=en",
    intagramUsername: "_zyozyo",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/7f7baefec3494f1c9f5fcce4da33a082-05_%EC%A7%80%ED%9A%A8_A_01.jpg",
  },
  {
    name: "Mina",
    instagram: "https://www.instagram.com/mina_sr_my/?hl=en",
    intagramUsername: "mina_sr_my",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/e51b87f4f2c84d80915013ede348c9d3-06_%E1%84%86%E1%85%B5%E1%84%82%E1%85%A1_A_01.jpg",
  },
  {
    name: "Dahyun",
    instagram: "https://www.instagram.com/dahhyunnee/?hl=en",
    intagramUsername: "dahhyunnee",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/195e086ea2a84f1cb4d02e55215fc5a6-07_%E1%84%83%E1%85%A1%E1%84%92%E1%85%A7%E1%86%AB_A_01.jpg",
  },
  {
    name: "Chaeyoung",
    instagram: "https://www.instagram.com/chaeyo.0/?hl=en",
    intagramUsername: "chaeyo.0",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/5650bb28312341e2833ac21d31cf85c9-08_%E1%84%8E%E1%85%A2%E1%84%8B%E1%85%A7%E1%86%BC_A_01.jpg",
  },
  {
    name: "Tzuyu",
    instagram: "https://www.instagram.com/thinkaboutzu/?hl=en",
    intagramUsername: "thinkaboutzu",
    profileImage:
      "https://lv2-cdn.azureedge.net/twice/9bf780eb00324567a24b255170949911-09_%E1%84%8D%E1%85%B3%E1%84%8B%E1%85%B1_A_02.jpg",
  },
];

const About = () => {
  const gridTemplateColumns = useBreakpointValue({
    base: "repeat(2, 1fr)",
    sm: "repeat(3, 1fr)",
    md: "repeat(3, 1fr)",
    lg: "repeat(5, 1fr)",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Discover TWICEFLIX, your ultimate hub for TWICE videos, Instagram profiles, and the latest updates on the sensational K-pop group."
        />
        <meta
          name="keywords"
          content="TWICE, TWICEFLIX, K-pop, TWICE Instagram, TWICE Members, TWICE Videos"
        />
        <meta name="author" content="RapSign" />
      </Helmet>

      <Box bg="black" color="white" minHeight="100vh" py={10}>
        <Container maxW="container.xl">
          <Heading
            mb={4}
            mt={10}
            color="red"
            textAlign="center"
            fontWeight="extrabold"
            size={{ base: "md", md: "xl" }}
          >
            About TWICEFLIX
          </Heading>
          <Text
            mb={6}
            textAlign={{ base: "justify", md: "center" }}
            fontSize={{ base: "sm", md: "lg" }}
          >
            Welcome to TWICEFLIX! We are your ultimate source for all things
            related to the sensational K-pop girl group, TWICE. Here, you can
            explore an extensive collection of TWICE's YouTube videos, ranging
            from their latest music videos to behind-the-scenes content. Stay
            up-to-date with all the latest TWICE content and never miss a moment
            of their incredible performances and activities.
          </Text>

          <Link
            href="https://www.youtube.com/c/TWICE"
            isExternal
            color="red"
            fontWeight="extrabold"
            display="block"
            textAlign="center"
            mb={8}
            fontSize={{ base: "sm", md: "lg" }}
            _hover={{ textDecoration: "none" }}
          >
            TWICE Official YouTube Channel
          </Link>

          <Heading
            size={{ base: "sm", md: "md" }}
            mb={4}
            color="white"
            textAlign="center"
            fontWeight="extrabold"
          >
            Follow TWICE Members on Instagram
          </Heading>
          <Grid templateColumns={gridTemplateColumns} gap={4}>
            {TWICE_MEMBERS.map((member) => (
              <Box
                key={member.name}
                borderRadius="xl"
                overflow="hidden"
                border="1px solid #3f3f3f"
                p={4}
                textAlign="center"
                transition="transform 0.3s ease, box-shadow 0.3s ease"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                }}
              >
                <Image
                  src={member.profileImage}
                  alt={member.name}
                  loading="lazy"
                  borderRadius="full"
                  boxSize={{ base: "100px", md: "150px" }}
                  objectFit="cover"
                  mb={4}
                  mx="auto"
                />
                <Text fontWeight="extrabold" color="red" mb={2}>
                  {member.name}
                </Text>
                <Button
                  as={Link}
                  href={member.instagram}
                  isExternal
                  color="white"
                  variant="ghost"
                  _hover={{ textDecoration: "none" }}
                  leftIcon={<FaInstagram />}
                >
                  {member.intagramUsername}
                </Button>
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default About;
