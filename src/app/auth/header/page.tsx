import GradientText from "@/components/GradientText";

export default function Header() {
  return (
    <>
      <GradientText
        colors={[
          "#9a6f0bff",
          "#bd9864ff",
          "#dbb56aff",
          "#7f7464ff",
          "#e9e99dff",
        ]}
        animationSpeed={5}
        showBorder={false}
        className="custom-class text-[65px] md:text-[70px] mt-2"
      >
        Kavyalok
      </GradientText>
    </>
  );
}
