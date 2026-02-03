import Link from 'next/link';
import React from 'react'

const popularSearches = [
  {
    title: "Candere Collections",
    links: ["Best Seller", "New Arrival"],
  },
  {
    title: "Jewellery",
    links: [
      "Diamond",
      "Gold",
      "Platinum",
      "Diamond Jewellery for Women",
      "Gold Jewellery for Women",
      "Diamond Jewellery for Men",
      "Gold Jewellery for Men",
    ],
  },
  {
    title: "Rings",
    links: [
      "Engagement Rings",
      "Diamond Rings",
      "Solitaire Rings",
      "Gold Rings",
      "Platinum Rings",
      "Casual Rings",
      "Classic Rings",
      "Navratna Rings",
      "Gemstone Rings",
    ],
  },
  {
    title: "Earrings",
    links: [
      "Solitaire Earrings",
      "Diamond Earrings",
      "Gold Earrings",
      "Platinum Earrings",
      "Stud Earrings",
      "Dangle Earrings",
      "Sui Dhaga Earrings",
      "Navratna Earrings",
      "Jhumkas",
      "Hoop Earrings",
      "Gemstone Earrings",
    ],
  },
  {
    title: "Necklace",
    links: [
      "Diamond Necklace",
      "Platinum Necklace",
      "Gemstone Necklace",
      "Gold Necklace",
      "Collar Necklace",
      "Layered Necklace",
      "Pendant Necklace",
      "Charm Necklace",
      "Delicate Necklace",
      "Lariat Necklace",
    ],
  },
  {
    title: "Bangles",
    links: ["Kada", "Delicate Bangles", "Eternity Bangles"],
  },
  {
    title: "Bracelets",
    links: ["Oval Bracelets", "Tennis Bracelets", "Chain Bracelets", "Flexi Bracelets"],
  },
  {
    title: "Solitaires",
    links: [
      "Solitaire Rings",
      "Solitaire Pendants",
      "Solitaire Nose Pins",
      "Earrings Solitaire",
      "Necklace Solitaire",
    ],
  },
  {
    title: "Mangalsutra",
    links: [
      "Solitaire Mangalsutra",
      "Mangalsutra Ring",
      "Mangalsutra with Chain",
      "Mangalsutra Bracelets",
      "Mangalsutra Chains",
    ],
  },
  {
    title: "Pendants",
    links: ["Initial Pendants", "Solitaire Pendants", "Pendants with Chain", "Casual Pendants"],
  },
  {
    title: "Other Jewellery",
    links: ["Peacock", "Chafa", "Butterfly", "Evil Eye", "Miracle Plate"],
  },
  {
    title: "Gifts",
    links: ["Anniversary Gifts", "Birthday Gifts", "Gifts for Him", "Gifts for Her", "Gifts for Kids"],
  },
];


const SecondFooter = () => {
  return (
    <section className="bg-white py-12 px-4 md:px-8">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-3xl font-bold mb-8">Popular Searches</h2>

    {popularSearches.map((section, index) => (
      <div key={index} className="mb-5">
        <h3 className={`text font-semibold mb-1 ${index === 0 ? 'text-base mb-1 font-semibold' : ''}`}>
          {section.title}
        </h3>
        <div className="flex flex-wrap gap-x-3 gap-y-2 text-gray-700 text-sm">
          {section.links.map((link, i) => (
            <React.Fragment key={i}>
              <Link href="#" className="hover:text-gray-900">
                {link}
              </Link>
              {i !== section.links.length - 1 && (
                <span className="border-l border-gray-300 h-4"></span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>

  )
}

export default SecondFooter
