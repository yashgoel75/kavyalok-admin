import Header from "@/components/header/page";
import Member from "./member/member";
import Navigation from "@/components/navigation/page";
import Footer from "@/components/footer/page";

import yashgoel from "@/assets/team/yash_goel.png";
import shraydobhal from "@/assets/team/shray.jpg";
import vaibhavarya from "@/assets/team/vaibhav_arya.png";

export default function Team() {
  const teamMembers = [
    {
      imageSrc: yashgoel,
      name: "Yash Goel",
      role: "Co-Founder & Lead Developer",
      linkedin: "https://linkedin.com/in/yashgoel75",
      instagram: "",
    },
    {
      imageSrc: shraydobhal,
      name: "Shray Dobhal",
      role: "Co-Founder & Product Lead",
      linkedin: "https://www.linkedin.com/in/shray-dobhal-5a9009308/",
      instagram: "https://www.instagram.com/shray_dobhal0413",
    },
    {
      imageSrc: vaibhavarya,
      name: "Vaibhav Arya",
      role: "UI/UX Lead",
      linkedin: "https://linkedin.com/in/vaibhav-arya-737772324",
      instagram: "https://instagram.com/vaibhav.aryaa",
    },
  ];

  return (
    <>
      <Header />
      <div className="w-[95%] min-h-[85vh] lg:w-full max-w-6xl mx-auto py-10 md:py-20 px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-5 lg:gap-10 justify-items-center">
          {teamMembers.map((member, index) => (
            <Member
              key={index}
              imageSrc={member.imageSrc}
              name={member.name}
              role={member.role}
              linkedin={member.linkedin}
              instagram={member.instagram}
            />
          ))}
        </div>
      </div>
      <Navigation />
      <div className="w-full bottom-0">
        <Footer />
      </div>
    </>
  );
}
