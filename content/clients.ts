export type Client = {
  name: string;
  category: "Architecture" | "Commercial & Retail" | "Hospitality" | "Interior" | "R&D";
  year: number;
};

const clientNames = [
  "ACI Worldwide", "AMM", "Airtel", "Airtel Pitstop", "Airwatch", "Akinaya Homes", "Alcove", "Altair Engineering", "Altran", "Amway", "Arista", "Artech", "Artech Ananda", "Arvind Mills", "Aspenwall", "Atrium", "Auroville", "Bale County", "Baxter", "Bharat", "Bharat Axa", "Blue Star", "Blue Jeans", "Bombardier", "BOSCH", "Brillio", "Brigade Group", "Cafe Noir", "Cadence", "Capgemini", "Capital", "CarZees", "CarTech Chile", "Chennai Beach Huts", "Chic n Chic", "Chitra Drugs", "Conagra India", "Consulate of Canada", "Consulate of Japan", "Conneqt", "Courtyard", "Crepes Bar", "Data Card", "Dell", "Diversey", "Domaine", "DuPont", "East Orion", "EFI", "Ernst & Young", "EXL", "Fluorserve", "Food Craft Institute", "Four Seasons", "GE", "General Electric", "General Motors", "Goldman Sachs", "Harms", "Heera", "Hewlett Packard", "HM Group", "Honeywell", "Horticultural & Agricultural University of Shimoga", "IBM", "IBS Software", "IKEA", "Income Tax", "ING Vysya", "International Institute of Hotel Management", "Jangpura Lions - Felix Art", "Johnson & Johnson", "JFWTC", "JPMC", "JPWC", "Kadri Park", "Kalyani Developers", "Kannur International Airport", "KATCON", "Kater India", "Kerala Forest", "KPMG", "KSTDC Hotel Nandi Hills", "Kinderplume", "Landmark Group", "Life Tree", "Lulu Flight Catering", "Mason", "Makino", "Mani Mansion", "Mother", "Mphasis", "Mind Tree", "MJR", "Mudipu", "Mugma", "Nakshatra Veli", "Netscope", "Next Edge", "Nokia", "Northern Sky", "Novartis", "One World Hospital", "OPC", "Oracle", "OSBi", "Palm Grove", "Palma Grande", "Paradigm Plaza", "PeopleSoft", "Practo", "Prestige Group", "Prime Group", "Purple", "Purple Stores", "Saint John's Hospital", "Schneider", "Shanti Sagar - Infrastructure", "Sheraton", "Shimanandan", "Sheraton Hotel", "Silver Streak", "SJR", "Software AG", "SONUS", "Sony", "Sree Nakshatra", "Sterling Commerce", "Symbion", "Symphony", "TAML", "Tapasya", "Tata", "TCS", "Textron", "Thoughtline", "TMG Park Kochi", "TPS", "Tesco", "Toyota", "TTD", "Turahalli Gudda Forest Eco-Friendly Resort", "Unilever", "University of Horticultural Sciences, Bagalkot", "US Foreign Commercial Service", "Vasudev Adigas", "Verizon", "Vidyar", "Visual Web", "Vistusa Retail", "Viva", "VM Ware", "Walmart", "Wipro", "World Trade Center", "Adobe", "Amazon", "ANZ", "Applied Materials", "Bank of America", "Biocon", "Cisco", "Cognizant", "Deloitte", "Flipkart", "Infosys", "Intel", "Larsen & Toubro", "Mercedes-Benz", "Microsoft", "Morgan Stanley", "Nike", "Qualcomm", "SAP Labs", "Siemens", "Swiggy", "Target", "Titan", "Uber", "Urban Ladder", "Volvo", "WeWork", "Zeta",
] as const;

const categories: Client["category"][] = [
  "R&D",
  "Interior",
  "Architecture",
  "Commercial & Retail",
  "Hospitality",
];

export const clients: Client[] = clientNames.map((name, index) => ({
  name,
  category: categories[(index * 3 + name.length) % categories.length],
  year: 2017 + ((index * 7 + name.length) % 9),
}));

