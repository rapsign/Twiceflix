import React from "react";
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

// TWICE Members data
const TWICE_MEMBERS = [
  {
    name: "Twicetagram",
    instagram: "https://www.instagram.com/twicetagram/?hl=en",
    profileImage:
      "https://cdn.inflact.com/media/453887384_1012915613901262_7075729037643510780_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F453887384_1012915613901262_7075729037643510780_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dinstagram.fkul16-2.fna.fbcdn.net%26_nc_cat%3D1%26_nc_ohc%3DT0sERQr-fzsQ7kNvgETAy8_%26_nc_gid%3Dc3005635cb854128975a43ff539333df%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYBk9YamxtBeK4xeRuhq_iaqrQVt1l8nTyKOQo4hZYWcwA%26oe%3D66E02778%26_nc_sid%3D8b3546&time=1725584400&key=9bdb2f947c872f74033486ed6613267d",
  },
  {
    name: "Nayeon",
    instagram: "https://www.instagram.com/nayeonyny/",
    profileImage:
      "https://cdn.inflact.com/media/294357840_1056946331848193_8592951666263680523_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F294357840_1056946331848193_8592951666263680523_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dinstagram.fyei1-2.fna.fbcdn.net%26_nc_cat%3D105%26_nc_ohc%3DgNIxmJUCQFkQ7kNvgHy_ijr%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYBrY1Yg7QWG-lcF93R1RjltTQJ-qLH01APkgmaziMW2WA%26oe%3D66E03553%26_nc_sid%3D8b3546&time=1725584400&key=41212d13a4f3c191e498c77db5980675",
  },
  {
    name: "Jeongyeon",
    instagram: "https://www.instagram.com/jy_piece/?hl=en",
    profileImage:
      "https://cdn.inflact.com/media/441099314_267924176313008_8195407146454360674_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F441099314_267924176313008_8195407146454360674_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dinstagram.fsof10-1.fna.fbcdn.net%26_nc_cat%3D1%26_nc_ohc%3DEnhqK33RaQ4Q7kNvgFgdPq1%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYCEIVrA62T8cscPvDF0Pli-x1aX5YG95Eui7RrVUK_e9A%26oe%3D66E0295F%26_nc_sid%3D8b3546&time=1725584400&key=54b46155ed745b54803c988b7ad179f4",
  },
  {
    name: "Momo",
    instagram: "https://www.instagram.com/momo/?hl=en",
    profileImage:
      "https://cdn.inflact.com/media/297950117_3142317252650751_4126400313311437451_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F297950117_3142317252650751_4126400313311437451_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dinstagram.fbeg4-1.fna.fbcdn.net%26_nc_cat%3D1%26_nc_ohc%3DjI59GBAB4XMQ7kNvgGwfx3Y%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYATI_6K-hqIDqqjXxPT-T8DcJYx4RPyqsJaM2NKQT7Dcg%26oe%3D66E03F63%26_nc_sid%3D8b3546&time=1725584400&key=c5c7984200d5b5b71d9c1d26baef6aa6",
  },
  {
    name: "Sana",
    instagram: "https://www.instagram.com/m.by__sana/?hl=en",
    profileImage:
      "https://cdn.inflact.com/media/340008369_179587014939666_6795348549267204846_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F340008369_179587014939666_6795348549267204846_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dscontent-zrh1-1.cdninstagram.com%26_nc_cat%3D1%26_nc_ohc%3DEPYEdfA6wWEQ7kNvgFDW8Dh%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYDjAsUbUXBJbPA2DfjIkOO4VfxV6NVcKfiFt2Bk39cbxQ%26oe%3D66E0211B%26_nc_sid%3D8b3546&time=1725584400&key=08e3e99762ca04306757f07c50a6544e",
  },
  {
    name: "Jihyo",
    instagram: "https://www.instagram.com/_zyozyo/?hl=en",
    profileImage:
      "https://cdn.inflact.com/media/366200180_822311156025108_1149992104142979043_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F366200180_822311156025108_1149992104142979043_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dinstagram.fleu1-2.fna.fbcdn.net%26_nc_cat%3D1%26_nc_ohc%3DP9pSTAFvGXgQ7kNvgHHk5Ta%26_nc_gid%3D8f9fe83f13624aafac96b4d0505a0ed7%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYDeIwC3Rm-ggLEk5YBO7Gk-kso5elSLJbAoJLEZF3W7-w%26oe%3D66E0299A%26_nc_sid%3D8b3546&time=1725584400&key=140125392c92fa9464ffd00c87d3b45d",
  },
  {
    name: "Mina",
    instagram: "https://www.instagram.com/mina_sr_my/?hl=en",
    profileImage:
      "https://cdn.inflact.com/media/280756657_2245547305593919_9214139594332754668_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F280756657_2245547305593919_9214139594332754668_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dinstagram.fsdu25-1.fna.fbcdn.net%26_nc_cat%3D1%26_nc_ohc%3DqcTqHzzKW6EQ7kNvgGMoxpW%26_nc_gid%3D62b7035c664b435f8d8f531fbf0f37c0%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYAKK_KPlJluGX0nnD_0LyuNrkezRPw6la0INhhd3o8psQ%26oe%3D66E019C6%26_nc_sid%3D8b3546&time=1725584400&key=1cbfe24aa1c3f8bc4b5aa95781b0ea62",
  },
  {
    name: "Dahyun",
    instagram: "https://www.instagram.com/dahhyunnee/?hl=en",
    profileImage:
      "https://cdn.inflact.com/media/281257169_397867378887435_1070554030893405798_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F281257169_397867378887435_1070554030893405798_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dscontent-ssn1-1.cdninstagram.com%26_nc_cat%3D1%26_nc_ohc%3DqfHhEY_u6Q8Q7kNvgFkFmVZ%26_nc_gid%3D881e0ec501164c67b68193935cf8bb8e%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYCX69kxhx8Ry-h53MvuxUdL4uvycGNOwoSM-Ayk6mtxcQ%26oe%3D66E034A9%26_nc_sid%3D8b3546&time=1725584400&key=3ad88df42aa945ab1297ddcb85b44ec5",
  },
  {
    name: "Chaeyoung",
    instagram: "https://www.instagram.com/chaeyo.0/?hl=en",
    profileImage:
      "https://cdn.inflact.com/media/281224187_5221875917871372_5821407330271285140_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F281224187_5221875917871372_5821407330271285140_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dscontent-ssn1-1.cdninstagram.com%26_nc_cat%3D1%26_nc_ohc%3Dja0Hi2UXcoEQ7kNvgE7ClZM%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYBE53TcjyI8Kzxlg1Xz4CkIjcI7tiw86XbVblAB97HI-Q%26oe%3D66E047BA%26_nc_sid%3D8b3546&time=1725584400&key=006d134a40571c49c83a7832c3086db8",
  },
  {
    name: "Tzuyu",
    instagram: "https://www.instagram.com/thinkaboutzu/?hl=en",
    profileImage:
      "https://cdn.inflact.com/media/281009682_536858364721466_5150834322021865551_n.jpg?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.2885-19%2F281009682_536858364721466_5150834322021865551_n.jpg%3Fstp%3Ddst-jpg_e0_s150x150%26_nc_ht%3Dscontent-atl3-2.cdninstagram.com%26_nc_cat%3D1%26_nc_ohc%3D4ymT-m0mz28Q7kNvgE_0FRt%26_nc_gid%3D961b264538d146c28b125e8ba7a251d7%26edm%3DAOQ1c0wBAAAA%26ccb%3D7-5%26oh%3D00_AYCs1T2dN5m6wPjzs6P59_aGDPgxkZX8xJaCoGvqpQZekA%26oe%3D66E01F9E%26_nc_sid%3D8b3546&time=1725584400&key=7ca5a8b761f051305b7b06ee7867e052",
  },
];

const About = () => {
  const gridTemplateColumns = useBreakpointValue({
    base: "repeat(2, 1fr)",
    sm: "repeat(3, 1fr)",
    md: "repeat(3, 1fr)",
    lg: "repeat(5, 1fr)",
  });

  return (
    <Box bg="black" color="white" minHeight="100vh" py={10}>
      <Container maxW="container.xl">
        <Heading
          mb={4}
          mt={{ base: "10", md: "20" }}
          color="red"
          textAlign="center"
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
          fontWeight="bold"
          display="block"
          textAlign="center"
          mb={8}
          fontSize={{ base: "sm", md: "lg" }}
          _hover={{ textDecoration: "underline" }}
        >
          TWICE Official YouTube Channel
        </Link>

        <Heading
          size={{ base: "sm", md: "md" }}
          mb={4}
          color="white"
          textAlign="center"
        >
          Follow TWICE Members on Instagram
        </Heading>
        <Grid templateColumns={gridTemplateColumns} gap={4}>
          {TWICE_MEMBERS.map((member) => (
            <Box
              key={member.name}
              borderRadius="md"
              overflow="hidden"
              border="1px solid rgba(255, 255, 255, 0.1)"
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
                borderRadius="full"
                boxSize={{ base: "100px", md: "200px" }}
                objectFit="cover"
                mb={4}
                mx="auto"
              />
              <Text fontWeight="bold" color="red" mb={2}>
                {member.name}
              </Text>
              <Button
                as={Link}
                href={member.instagram}
                isExternal
                color="white"
                variant="ghost"
                _hover={{ textDecoration: "underline" }}
                leftIcon={<FaInstagram />}
              >
                Instagram
              </Button>
            </Box>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
