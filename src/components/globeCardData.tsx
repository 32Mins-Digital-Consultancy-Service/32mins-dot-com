/**
 * Content for the globe's three info points. Kept separate from the
 * GlobeCard component so fast-refresh sees component-only modules.
 */

export type CardType = "" | "card1" | "card2" | "card3";

export interface GlobeCardData {
  id: Exclude<CardType, "">;
  ariaLabel: string;
  cardPosition: "left" | "center" | "right";
  content: React.ReactNode;
}

export const cardData: GlobeCardData[] = [
  {
    id: "card1",
    ariaLabel: "Show SDG4 info",
    cardPosition: "left",
    content: (
      <>
        <img
          src="/UN x SDG4.png"
          alt="UN SDG4"
          className="max-w-full sm:max-w-[280px] md:max-w-[300px]"
        />
        <p className="mb-3 mt-4 sm:mt-6 text-sm sm:text-base font-normal text-gray-200">
          Ensure inclusive and equitable quality education and promote lifelong
          learning opportunities for all.
        </p>
      </>
    ),
  },
  {
    id: "card3",
    ariaLabel: "Show GeM & Startup India info",
    cardPosition: "center",
    content: (
      <>
        <div className="flex gap-2 sm:gap-4 justify-start">
          <img
            src="/GeM.webp"
            alt="GeM"
            className="max-w-[80px] sm:max-w-[100px] md:max-w-[120px]"
          />
          <img
            src="/SI.webp"
            alt="Startup India"
            className="max-w-[80px] sm:max-w-[100px] md:max-w-[120px]"
          />
        </div>
        <p className="mb-3 mt-4 sm:mt-6 text-sm sm:text-base font-normal text-gray-200">
          Proud Part of Startup India and GeM
        </p>
      </>
    ),
  },
  {
    id: "card2",
    ariaLabel: "Show IITM Pravartak info",
    cardPosition: "right",
    content: (
      <>
        <img
          src="/IITM PIS.png"
          alt="IITM Pravartak"
          className="max-w-[120px] sm:max-w-[150px] md:max-w-[175px]"
        />
        <p className="mb-3 mt-4 sm:mt-6 text-sm sm:text-base font-normal text-gray-200">
          We're proud to share that 32Mins Digital Consultancy Services is now
          incubated under the esteemed wing of the IITM Pravartak Technologies
          Foundation
        </p>
      </>
    ),
  },
];
