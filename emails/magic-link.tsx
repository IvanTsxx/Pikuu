import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { env } from "@/env/server";

interface MagicLinkEmailProps {
  appName: string;
  logoUrl?: string;
  magicLinkUrl: string;
  expiresIn?: string;
}

const baseUrl = env.APP_URL;

export const MagicLinkEmail = ({
  appName,

  magicLinkUrl,
  expiresIn,
}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
      }}
    >
      <Body className="bg-white font-raycast">
        <Preview>Log in with this magic link.</Preview>
        <Container className="mx-auto my-0 bg-[url('/static/raycast-bg.png')] bg-bottom bg-no-repeat px-[25px] pt-5 pb-12">
          <Img
            alt="Raycast"
            height={48}
            src={`${baseUrl}/static/raycast-logo.png`}
            width={48}
          />
          <Heading className="mt-12 font-bold text-[28px]">
            🪄 Your magic link
          </Heading>
          <Section className="mx-0 my-6">
            <Text className="text-base leading-6.5">
              <Link className="text-[#FF6363]" href={magicLinkUrl}>
                👉 Click here to sign in 👈
              </Link>
            </Text>
            <Text className="text-base leading-6.5">
              If you didn't request this, please ignore this email.
            </Text>
          </Section>
          <Text className="text-base leading-6.5">
            Best,
            <br />- Raycast Team
          </Text>
          <Hr className="mt-12 border-[#dddddd]" />
          <Img
            className="filter-[grayscale(100%)] mx-0 my-5"
            height={32}
            src={`${baseUrl}/static/raycast-logo.png`}
            style={{
              WebkitFilter: "grayscale(100%)",
            }}
            width={32}
          />
          <Text className="ml-1 text-[#8898aa] text-xs leading-6">
            {appName}
          </Text>
          <Text className="ml-1 text-[#8898aa] text-xs leading-6">
            Expires in {expiresIn}
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

MagicLinkEmail.PreviewProps = {
  appName: "Pikuu",
  expiresIn: "15 minutes",
  logoUrl: `${env.APP_URL}/static/raycast-logo.png`,
  magicLinkUrl: `${env.APP_URL}/auth/magic?token=1234567890`,
} as MagicLinkEmailProps;

export default MagicLinkEmail;
