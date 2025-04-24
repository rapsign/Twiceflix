import {
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const DashboardCard = ({ to, icon: IconComponent, count, label }) => (
  <Link to={to}>
    <Card
      bg="#3F3F3F"
      color="white"
      _hover={{ cursor: "pointer", bg: "#1f1f1f" }}
    >
      <CardBody
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Stat textAlign="center">
          <StatLabel>
            <Flex alignItems="center" gap={2} justify="center">
              <IconComponent size="4em" />
            </Flex>
          </StatLabel>
          <StatNumber mt={2} fontWeight="normal">
            {count}
          </StatNumber>
          <StatHelpText>
            <Heading fontSize="xl" fontWeight="normal" mt={2}>
              {label}
            </Heading>
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  </Link>
);

export default DashboardCard;
