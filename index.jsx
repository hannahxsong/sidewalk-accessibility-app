import { FilterButtons } from "./FilterButtons";
import { PropertyCheckedWrapper } from "./PropertyCheckedWrapper";
import { StatusDot } from "./StatusDot";
import arrowForwardIos from "./arrow-forward-ios.png";
import line1 from "./line-1.svg";
import line2 from "./line-2.svg";
import line3 from "./line-3.svg";
import line4 from "./line-4.svg";
import line5 from "./line-5.svg";
import line6 from "./line-6.svg";
import rectangle4 from "./rectangle-4.svg";
import rectangle5 from "./rectangle-5.svg";
import screenshot20260131At110853Pm1 from "./screenshot-2026-01-31-at-11-08-53-PM-1.svg";
import screenshot20260131At111000Pm2 from "./screenshot-2026-01-31-at-11-10-00-PM-2.png";
import screenshot20260131At111306Pm2 from "./screenshot-2026-01-31-at-11-13-06-PM-2.png";
import yellowAndWhiteRoundCuteIllustratedCatPetShopLogo11 from "./yellow-and-white-round-cute-illustrated-cat-pet-shop-logo-1-1.png";
import yellowAndWhiteRoundCuteIllustratedCatPetShopLogo21 from "./yellow-and-white-round-cute-illustrated-cat-pet-shop-logo-2-1.svg";

export const MapPageNavBar = () => {
  return (
    <div className="bg-white overflow-x-hidden w-full min-w-[1280px] min-h-[813px] relative">
      <img
        className="absolute -top-px -left-2 w-[334px] h-[814px]"
        alt="Rectangle"
        src={rectangle4}
      />

      <img
        className="absolute top-[7px] left-[294px] w-[15px] h-[15px] aspect-[1]"
        alt="Arrow forward ios"
        src={arrowForwardIos}
      />

      <FilterButtons
        className="!h-[124px] !justify-end !absolute !flex !left-[17px] !items-center !w-[284px] !top-[108px]"
        divClassName="!h-[13px] !mr-[7px] !-mt-px !right-[unset] !relative !top-[unset]"
        text=""
      />
      <FilterButtons
        className="!h-[89px] !justify-end !absolute !flex !left-[17px] !items-center !w-[284px] !top-[486px]"
        divClassName="!h-[13px] !mr-[7px] !right-[unset] !relative !top-[unset]"
        text=""
      />
      <FilterButtons
        className="!h-[89px] !justify-end !absolute !flex !left-[17px] !items-center !w-[284px] !top-[368px]"
        divClassName="!h-[13px] !mr-[7px] !right-[unset] !relative !top-[unset]"
        text=""
      />
      <img
        className="top-[430px] left-[50px] w-[232px] absolute h-[3px]"
        alt="Line"
        src={line3}
      />

      <img
        className="top-[545px] left-[49px] w-[232px] absolute h-[3px]"
        alt="Line"
        src={line5}
      />

      <div className="absolute top-[380px] left-[53px] opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
        Max Incline
      </div>

      <div className="absolute top-[497px] left-[50px] opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
        Safeness
      </div>

      <PropertyCheckedWrapper
        className="!absolute !left-[174px] !top-[189px]"
        property1="variant-2"
      />
      <PropertyCheckedWrapper
        className="!h-7 !aspect-[3.11] !left-[174px] !absolute !top-[147px]"
        property1="variant-2"
      />
      <PropertyCheckedWrapper
        className="!left-[61px] !absolute !top-[148px]"
        property1="variant-2"
      />
      <PropertyCheckedWrapper
        className="!left-[61px] !absolute !top-[190px]"
        property1="variant-2"
      />
      <div className="absolute top-[196px] left-[93px] w-[50px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[11px] tracking-[0] leading-[normal]">
        Asphalt
      </div>

      <div className="absolute top-[154px] left-[95px] w-[50px] text-black [font-family:'Inter-Bold',Helvetica] font-bold text-[11px] tracking-[0] leading-[normal]">
        Brick
      </div>

      <div className="absolute top-[115px] left-[52px] opacity-75 [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
        Floor Surface
      </div>

      <div className="absolute top-[26px] left-[29px] w-[267px] [-webkit-text-stroke:1px_#0000001a] [font-family:'Rubik_Doodle_Shadow-Regular',Helvetica] font-normal text-[#2b3b29] text-[32px] tracking-[0] leading-[normal]">
        EMERALD PATH
      </div>

      <div className="absolute top-[154px] left-[203px] w-[50px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[11px] tracking-[0] leading-[normal]">
        Concrete
      </div>

      <div className="absolute top-[196px] left-[205px] w-[50px] [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[11px] tracking-[0] leading-[normal]">
        Other
      </div>

      <FilterButtons
        className="!h-[89px] !justify-end !absolute !flex !left-[17px] !items-center !w-[284px] !top-[245px]"
        divClassName="!h-[13px] !mr-[7px] !right-[unset] !relative !top-[unset]"
        text=""
      />
      <div className="absolute top-[255px] left-[250px] opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold text-[#135027] text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
        7.2 ft.
      </div>

      <div className="absolute top-[380px] left-[250px] opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold text-[#135027] text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
        18%
      </div>

      <div className="top-[501px] left-[254px] text-[#135027] text-[15px] absolute opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold tracking-[0] leading-[normal] whitespace-nowrap">
        20%
      </div>

      <div className="absolute top-[255px] left-[52px] opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
        Path Width
      </div>

      <div className="absolute top-[309px] left-[46px] opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[7px] tracking-[0] leading-[normal] whitespace-nowrap">
        0 ft.
      </div>

      <div className="top-[435px] left-[47px] text-black text-[7px] absolute opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold tracking-[0] leading-[normal] whitespace-nowrap">
        0%
      </div>

      <div className="absolute top-[309px] left-[273px] opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold text-black text-[7px] tracking-[0] leading-[normal] whitespace-nowrap">
        15 ft.
      </div>

      <div className="top-[435px] left-[274px] text-black text-[7px] absolute opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold tracking-[0] leading-[normal] whitespace-nowrap">
        20%
      </div>

      <div className="top-[550px] left-[271px] text-black text-[7px] absolute opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold tracking-[0] leading-[normal] whitespace-nowrap">
        100%
      </div>

      <img
        className="top-[304px] left-[47px] w-[232px] absolute h-[3px]"
        alt="Line"
        src={line1}
      />

      <img
        className="top-[304px] left-[47px] w-[100px] absolute h-[3px]"
        alt="Line"
        src={line2}
      />

      <img
        className="top-[430px] left-[50px] w-[185px] absolute h-[3px]"
        alt="Line"
        src={line4}
      />

      <img
        className="top-[545px] left-[49px] w-12 absolute h-[3px]"
        alt="Line"
        src={line6}
      />

      <StatusDot className="!absolute !top-[300px] !left-[143px] !w-2.5 !h-2.5" />
      <StatusDot className="!top-[426px] !left-[234px] !absolute !w-2.5 !h-2.5" />
      <StatusDot className="!top-[542px] !left-[95px] !absolute !w-2.5 !h-2.5" />
      <img
        className="absolute top-0 left-[1157px] w-[123px] h-[123px] aspect-[1] object-cover"
        alt="Yellow and white"
        src={yellowAndWhiteRoundCuteIllustratedCatPetShopLogo11}
      />

      <div className="top-[550px] left-[49px] text-black text-[7px] absolute opacity-85 [font-family:'Inter-Bold',Helvetica] font-bold tracking-[0] leading-[normal] whitespace-nowrap">
        0%
      </div>

      <img
        className="absolute top-[152px] left-[72px] w-[21px] h-[15px] aspect-[1.4] object-cover"
        alt="Screenshot"
        src={screenshot20260131At110853Pm1}
      />

      <img
        className="absolute top-[191px] left-[70px] w-[21px] h-5 aspect-[1.05] object-cover"
        alt="Screenshot"
        src={screenshot20260131At111306Pm2}
      />

      <img
        className="absolute top-[153px] left-[181px] w-[18px] h-[15px] aspect-[1.22] object-cover"
        alt="Screenshot"
        src={screenshot20260131At111000Pm2}
      />

      <img
        className="absolute top-[592px] left-[11px] w-[291px] h-[207px] aspect-[1.41]"
        alt="Yellow and white"
        src={yellowAndWhiteRoundCuteIllustratedCatPetShopLogo21}
      />

      <img
        className="absolute top-[766px] left-[1161px] w-[101px] h-[33px]"
        alt="Rectangle"
        src={rectangle5}
      />

      <div className="absolute top-[774px] left-[1171px] w-20 [-webkit-text-stroke:1px_#0000001a] [font-family:'Rubik_Doodle_Shadow-Regular',Helvetica] font-normal text-[#2b3b29] text-[15px] tracking-[0] leading-[normal] whitespace-nowrap">
        ABOUT US
      </div>
    </div>
  );
};
