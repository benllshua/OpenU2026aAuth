import { Button, Flex, Text } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import TwoFactSettings from "../components/TwoFactSettings";
import User, { IUser } from "../models/User";
import db from "../utils/db";

export default function Profile({ user }: { user: IUser }) {
  return (
    <Flex
      w={"50%"}
      mx={"auto"}
      flexDirection={"column"}
      justifyContent={"center"}
      my={5}
      fontFamily={"monospace"}
    >
      <Text color={"teal.500"} fontSize="lg" textAlign={"center"}>
        Welcome {user?.name} to our website
      </Text>
      <TwoFactSettings user={user} />
      <Button
        my={5}
        borderRadius={"full"}
        bgColor={"#319795"}
        fontFamily={"monospace"}
        color={"white"}
        w={"60%"}
        mx={"auto"}
        _hover={{
          bgColor: "transparent",
          color: "#319795",
          border: "2px solid #319795",
        }}
        onClick={() => signOut()}
      >
        Sign Out
      </Button>
    </Flex>
  );
}

//@ts-ignore
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  await db.connect();
  const user = await User.findOne<IUser>({
    email: session?.user?.email,
  }).select({ password: 0, twoFactorSecret: 0 });

  return {
    props: { session, user: user?.toJSON() },
  };
};
