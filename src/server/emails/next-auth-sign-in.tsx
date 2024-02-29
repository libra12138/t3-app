import {
  Tailwind,
  Html,
  Button,
  Body,
  Container,
  Text,
  Row,
  Section,
  Hr,
} from "@react-email/components";
import { format } from "date-fns";

export function NextAuthSignIn(props: {
  identifier: string;
  url: string;
  escapedHost: string;
}) {
  const { url, escapedHost, identifier } = props;
  const now = format(new Date(), "yyyy-MM-dd HH:mm");
  return (
    <Html>
      <Tailwind>
        <Body className="font-sans">
          <Container className="m-auto  p-4">
            <Section className="flex items-center text-lg ">
              Sign in to{" "}
              <Text className="inline-block font-bold">{escapedHost}</Text>
            </Section>
            <Text className="text-base">Hi {identifier}.</Text>
            <Hr className="my-4 bg-[#ccc]" />
            <Text className="mt-2 text-base">
              Welcome to Koala, the sales intelligence platform that helps you
              uncover qualified leads and close deals faster.
            </Text>
            <Section className="text-center">
              <Button
                className="rounded bg-[#5F51E8] px-5 py-3 text-center text-base text-white"
                href={url}
              >
                Get started
              </Button>
            </Section>
            <Section className="flex w-full  items-end justify-between">
              <Text className="inline-block text-base">The Koala team</Text>
              <Text className="inline-block  text-sm text-gray-400">{now}</Text>
            </Section>
            <Hr className="my-4 bg-[#ccc]" />
            <Text className="text-sm text-[#8898aa]">
              470 Noor Ave STE B #1148, South San Francisco, CA 94080
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
