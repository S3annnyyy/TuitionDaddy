import { useEffect, useState } from 'react';
import { AccordionItemProps } from '../utils/types';
import { getPurchasedResources } from '../utils/mktplaceFunctions';

const AccordionItem: React.FC<AccordionItemProps> = ({ title, pdfUrl }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-300 rounded-md mb-4">
      <div
        className="flex justify-between items-center bg-gray-100 py-2 px-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xl">{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="p-4">
          <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
        </div>
      )}
    </div>
  );
};

const Profile: React.FC = () => {
  const [resourceLinks, setResourceLinks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const data = sessionStorage.getItem('resourceLinks');
    if (data !== null) {
      setResourceLinks(JSON.parse(data));
    } else {
      // pull from user DB
      const userID = sessionStorage.getItem("userid")
      if (userID) {
        getPurchasedResources(userID)
        .then(res => {
          setResourceLinks(res?.data.resource_links);
        })        
      }
    }
    console.log(resourceLinks);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Study Resources</h2>
      {Object.entries(resourceLinks).map(([title, pdfUrl], index) => (
        <AccordionItem key={index} title={title} pdfUrl={pdfUrl} />
      ))}
    </div>
  );
};

export default Profile;