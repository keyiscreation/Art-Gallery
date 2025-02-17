import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-black">
        <Text>SHOP</Text>
        <Text as="h2">LIMITED EDITION PRINTS</Text>
        <Text as="h1">LOREM IPSUM</Text>
        <Button >LIMITED EDITION</Button>
      </div>
    </>
  );
}
