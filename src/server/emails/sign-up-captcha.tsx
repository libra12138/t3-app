import {
  Tailwind,
  Html,
  Body,
  Container,
  Text,
  Section,
  Hr,
} from "@react-email/components";

export function SignUpCaptcha(props: { email: string; captcha: string }) {
  const { email, captcha } = props;
  return (
    <Html>
      <Tailwind>
        <Body className="font-sans">
          <Container className="m-auto  p-4">
            <Section className="flex items-center text-lg ">欢迎注册</Section>
            <Text className="text-base">"{email}"，你好！</Text>
            <Hr className="my-4 bg-[#ccc]" />
            <Text className="mt-2 text-base">
              注册的验证码为：
              <Text className=" text-lg font-bold italic text-black">
                {captcha}
              </Text>
            </Text>
            <Section className="flex w-full  items-end justify-between">
              <Text className="inline-block text-base">The Koala team</Text>
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
