import React, { useState, useEffect } from 'react';
import { chassisOptions, customizationOptions, colorOptions, cabinetOptions } from '../data/vanData';
import { cn } from '../lib/utils';
import type { VanConfiguration } from '../types';
import testImage from '../assets/test.png';
import '../styles/fonts.css';

// Import cabinet images
import wcImage from '../assets/wc.png';
import wcbImage from '../assets/wb.png';
import gcImage from '../assets/gc.png';
import gcbImage from '../assets/gb.png';
import logo from '../assets/logo.png';

// Import ShadCN components
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Menubar, MenubarItem } from './ui/menubar';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';

// Import van interior layers
import emptyVan from '../assets/144/44 SS Empty.png';
import finishedWall from '../assets/144/44 SS Finished Wall.png';
import whiteWall from '../assets/144/44 SS White Wall.png';
import paintedCab from '../assets/144/44 SS Painted Cab.png';
import whiteCab from '../assets/144/44 SS White Cab.png';
import bed from '../assets/144/44 SS Bed.png';
import mapleCounter from '../assets/144/44 SS Maple Counter.png';
import teakCounter from '../assets/144/44 SS Teak Counter.png';
import walnutCounter from '../assets/144/44 SS Walnut Counter.png';
import frontSeats from '../assets/144/44 SS Front Seats.png';

// Define the category types
type CategoryType = 
  | 'chassis' 
  | 'colors'
  | 'models'
  | 'wallcolor'
  | 'upholstery' 
  | 'electrical' 
  | 'heating'
  | 'exterior' 
  | 'bathroom' 
  | 'kitchen' 
  | 'lighting'
  | 'power'
  | 'cabinets';

type ViewType = 'interior' | 'exterior' | 'rear' | 'reartop';

// Define the order of categories
const CATEGORY_ORDER: CategoryType[] = [
  'chassis', 'models', 'wallcolor', 'colors', 'cabinets', 'upholstery', 'electrical', 'heating',
  'exterior', 'bathroom', 'kitchen', 'lighting', 'power'
];

interface CategoryProps {
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
  isLocked: boolean;
}

// Updated Category component with locked state styling
const Category: React.FC<CategoryProps> = ({ title, isActive, isCompleted, onClick, isLocked }) => {
  let icon = null;
  
  if (isLocked) {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    );
  } else if (isActive) {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    );
  } else if (isCompleted) {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  } else {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  }

  return (
    <div 
      className={cn(
        "py-3.5 px-4 relative transition-all duration-200 mx-3 rounded-lg",
        isLocked 
          ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-75"
          : isActive 
            ? "bg-[#F8BC40] text-white shadow-sm cursor-pointer" 
            : isCompleted
              ? "text-gray-700 hover:bg-white/50 border-l-4 border-green-500 cursor-pointer"
              : "text-gray-600 hover:bg-white/50 hover:text-gray-900 cursor-pointer",
      )}
      onClick={() => !isLocked && onClick()}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm tracking-wide font-medium leading-none">{title}</span>
        <div className="ml-3 flex-shrink-0">{icon}</div>
      </div>
    </div>
  );
};

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChassis: Chassis | null;
  selectedModel: Model | null;
  selectedColor: string;
  selectedOptions: string[];
  totalPrice: number;
  getUpgradesTotal: () => number;
  calculateTotal: () => number;
  upholsteryOptions: Array<{ id: string; name: string; price: number; }>;
  heatingOptions: Array<{ id: string; name: string; price: number; }>;
  customizationOptions: Array<{ id: string; name: string; price: number; category: string; }>;
}

const EmailModal: React.FC<EmailModalProps> = ({ 
  isOpen, 
  onClose,
  selectedChassis,
  selectedModel,
  selectedColor,
  selectedOptions,
  totalPrice,
  getUpgradesTotal,
  calculateTotal,
  upholsteryOptions,
  heatingOptions,
  customizationOptions
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [favoriteband, setFavoriteBand] = useState('');
  const [comments, setComments] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setPhone('');
      setFavoriteBand('');
      setComments('');
      setLocation('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please enter your name');
      setIsSubmitting(false);
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    if (!phone.trim()) {
      setError('Please enter your phone number');
      setIsSubmitting(false);
      return;
    }
    
    if (!favoriteband.trim()) {
      setError('Please enter your favorite band');
      setIsSubmitting(false);
      return;
    }

    try {
      // Format the configuration details in a readable way
      const formattedConfig = {
        // Customer Details
        customer_details: {
          name,
          email,
          phone,
          favorite_band: favoriteband
        },
        
        // Base Configuration
        base_configuration: {
          chassis: selectedChassis ? {
            model: selectedChassis.name,
            price: `$${selectedChassis.priceAdjustment.toLocaleString()}`
          } : 'Not Selected',
          
          package: selectedModel ? {
            name: selectedModel.name,
            price: `$${selectedModel.price.toLocaleString()}`
          } : 'Not Selected',
          
          exterior_color: selectedColor.replace('silver', 'Silver')
            .replace('white', 'Arctic White')
            .replace('black', 'Obsidian Black')
            .replace('gray', 'Tenorite Gray') || 'Not Selected'
        },

        // Selected Upgrades
        selected_upgrades: {
          // Cabinet Options
          cabinets: selectedOptions.find(opt => opt.includes('cabinet-'))?.replace('cabinet-alder', 'Finished Alder')
            .replace('cabinet-white', 'White')
            .replace('cabinet-painted', 'Painted') || 'None Selected',
          
          // Upholstery Options
          upholstery: selectedOptions.filter(opt => opt.includes('upholstery-')).map(opt => 
            opt.replace('upholstery-leather', 'Premium Leather')
              .replace('upholstery-fabric', 'Durable Fabric')
              .replace('upholstery-vinyl', 'Marine-Grade Vinyl')
          ),
          
          // Heating & Cooling
          climate_control: selectedOptions.filter(opt => opt.includes('heating-')).map(opt =>
            opt.replace('heating-diesel', 'Diesel Heater System')
              .replace('heating-ac', 'Air Conditioning')
          ),
          
          // Exterior Features
          exterior_features: selectedOptions.filter(opt => opt.includes('exterior-')).map(opt =>
            opt.replace('exterior-awning-motorized', 'Motorized Feeama 45s Awning')
              .replace('exterior-awning', 'Feeama 45s Awning')
              .replace('exterior-roofrack', 'Flatline LowPro Roofrack')
              .replace('exterior-frontbumper', 'Flatline VanCo Front Bumper')
              .replace('exterior-bullbar', 'Front BullBar')
              .replace('exterior-skidplate', 'Skidplate')
              .replace('exterior-winch', 'Warner VR Evo 12s Winch')
              .replace('exterior-rearbumper', 'Flatline Van Co Rear Bumper')
              .replace('exterior-ladder', 'Sprinter Side Ladder Wheel Wrap')
              .replace('exterior-sidesteps', 'Sprinter Van Side Steps')
              .replace('exterior-storagebox', 'Van Rear Storage Box')
              .replace('exterior-platform', 'Sprinter Van Rear Door Platform')
          ),
          
          // Bathroom Options
          bathroom: selectedOptions.filter(opt => opt.includes('bathroom-')).map(opt =>
            opt.replace('bathroom-toilet', 'Composting Toilet')
              .replace('bathroom-shower', 'Indoor Shower System')
              .replace('bathroom-outdoorshower', 'Outdoor Shower')
          ),
          
          // Kitchen Features
          kitchen: selectedOptions.filter(opt => opt.includes('kitchen-')).map(opt =>
            opt.replace('kitchen-stove-mounted', '2 Burner Stove Mounted')
              .replace('kitchen-stove-unmounted', '2 Burner Stove Unmounted')
              .replace('kitchen-countertop-teak', 'Teak Countertop')
              .replace('kitchen-countertop-walnut', 'Walnut Countertop')
              .replace('kitchen-countertop-maple', 'Maple Countertop')
          ),
          
          // Lighting Systems
          lighting: selectedOptions.filter(opt => opt.includes('lighting-')).map(opt =>
            opt.replace('lighting-premium', 'Premium Lighting')
              .replace('lighting-accent', 'Accent Lighting')
              .replace('lighting-exterior', 'Exterior Lighting')
          ),
          
          // Power Systems
          power: selectedOptions.filter(opt => opt.includes('power-')).map(opt =>
            opt.replace('power-weekender', 'Weekender 300Ah')
              .replace('power-staycool', 'Stay Cool 400Ah')
              .replace('power-staycool-extender', 'Stay Cool Extender 600Ah')
          )
        },

        // Pricing Summary
        pricing_summary: {
          base_chassis_price: `$${selectedChassis?.priceAdjustment.toLocaleString() || 0}`,
          package_price: `$${selectedModel?.price.toLocaleString() || 0}`,
          upgrades_total: `$${getUpgradesTotal().toLocaleString()}`,
          total_price: `$${calculateTotal().toLocaleString()}`
        }
      };

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '245e3966-536c-4be0-a992-fbcf0467bb7d',
          from_name: name,
          subject: `Van Configuration Request - ${name} - ${selectedModel?.name || 'Package Not Selected'}`,
          message: `Van Configuration Summary
------------------------
Base Van: ${selectedChassis?.name || 'Not Selected'} - $${selectedChassis?.priceAdjustment.toLocaleString() || 0}
Package: ${selectedModel?.name || 'Not Selected'} - $${selectedModel?.price.toLocaleString() || 0}
Color: ${formattedConfig.base_configuration.exterior_color}

Selected Options
---------------
${selectedOptions.length > 0 ? `
Interior
• Cabinets: ${formattedConfig.selected_upgrades.cabinets}
• Upholstery: ${Array.isArray(formattedConfig.selected_upgrades.upholstery) ? formattedConfig.selected_upgrades.upholstery.join(', ') : 'None'}
• Kitchen: ${Array.isArray(formattedConfig.selected_upgrades.kitchen) ? formattedConfig.selected_upgrades.kitchen.join(', ') : 'None'}
• Bathroom: ${Array.isArray(formattedConfig.selected_upgrades.bathroom) ? formattedConfig.selected_upgrades.bathroom.join(', ') : 'None'}

Systems
• Climate: ${Array.isArray(formattedConfig.selected_upgrades.climate_control) ? formattedConfig.selected_upgrades.climate_control.join(', ') : 'None'}
• Power: ${Array.isArray(formattedConfig.selected_upgrades.power) ? formattedConfig.selected_upgrades.power.join(', ') : 'None'}
• Lighting: ${Array.isArray(formattedConfig.selected_upgrades.lighting) ? formattedConfig.selected_upgrades.lighting.join(', ') : 'None'}

Exterior
• Features: ${Array.isArray(formattedConfig.selected_upgrades.exterior_features) ? formattedConfig.selected_upgrades.exterior_features.join(', ') : 'None'}` 
: 'No options selected'}

Customer Details
---------------
Name: ${name}
Email: ${email}
Phone: ${phone}
Location: ${location}
Favorite Band: ${favoriteband}

Price Summary
------------
Base Van:     $${selectedChassis?.priceAdjustment.toLocaleString() || 0}
Package:      $${selectedModel?.price.toLocaleString() || 0}
Options:      $${getUpgradesTotal().toLocaleString()}
Total Price:  $${calculateTotal().toLocaleString()}

${comments ? `Additional Notes:\n${comments}` : ''}`
        }),
      });

      const result = await response.json();
      
      if (result.success) {
      setIsSubmitting(false);
        onClose();
        alert('Thank you! We\'ve received your configuration request and will contact you soon.');
      } else {
        throw new Error('Failed to send form');
      }
    } catch (error) {
      setError('Failed to send form. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <Card className="z-10 w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-100/50 rounded-2xl my-8">
        <CardHeader className="pb-1 relative">
          <div className="flex flex-col items-center">
            <img src={logo} alt="Chewy Logo" className="h-24 w-auto mb-1" />
          </div>
          <CardDescription className="text-gray-600 mt-1 text-sm text-center px-4">
            Enter your information to receive your emailed estimate and more information regarding our process.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-2.5 py-2">
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Your Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#F8BC40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 p-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8BC40] focus:border-transparent transition-all text-sm"
                  autoFocus
                  required
                />
              </div>
            </div>
            
            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#F8BC40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 p-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8BC40] focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>
            
            {/* Phone Field */}
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#F8BC40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 p-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8BC40] focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>
            
            {/* Location Field */}
            <div className="space-y-1">
              <label htmlFor="location" className="text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#F8BC40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setError('');
                  }}
                  placeholder="City, State"
                  className="w-full pl-9 p-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8BC40] focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>
            
            {/* Favorite Band Field */}
            <div className="space-y-1">
              <label htmlFor="favoriteband" className="text-sm font-medium text-gray-700">Favorite Band</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#F8BC40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <input
                  id="favoriteband"
                  type="text"
                  value={favoriteband}
                  onChange={(e) => {
                    setFavoriteBand(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 p-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8BC40] focus:border-transparent transition-all text-sm"
                  required
                />
              </div>
            </div>
            
            {/* Comments Field */}
            <div className="space-y-1">
              <label htmlFor="comments" className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <span>Comments</span>
                <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <div className="relative">
                <textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => {
                    setComments(e.target.value);
                    setError('');
                  }}
                  placeholder="Share your thoughts or any special requests..."
                  className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F8BC40] focus:border-transparent transition-all text-sm min-h-[60px] resize-none"
                />
              </div>
            </div>
            
              {error && (
              <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-red-600 text-xs flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
            </div>
            )}
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 pt-1 pb-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => handleSubmit(e as any)}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#F8BC40] hover:bg-[#E6AB30] text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Updated GlobalStyles component with better animations and scrollbar
const GlobalStyles: React.FC = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      body {
        font-family: 'Open Sans', sans-serif;
      }
      
      .custom-scrollbar::-webkit-scrollbar {
        width: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(248, 188, 64, 0.4);
        border-radius: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(248, 188, 64, 0.6);
      }

      .fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      .slide-in {
        animation: slideIn 0.5s ease-in-out;
      }
      
      @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      .option-transition {
        transition: all 0.2s ease-in-out;
      }
      
      .option-transition:hover {
        transform: translateY(-2px);
      }
      
      @media (max-width: 1280px) {
        .mobile-stack {
          flex-direction: column;
        }
        
        .mobile-full {
          width: 100%;
        }
      }
    `
  }} />
);

// Enhanced OptionItem component with animations and better styling
const OptionItem = ({ 
  isSelected, 
  name, 
  price, 
  onClick, 
  showPrice = true 
}: { 
  isSelected: boolean; 
  name: string; 
  price?: number; 
  onClick: (e: React.MouseEvent) => void;
  showPrice?: boolean;
}) => (
  <div 
    className={cn(
      "flex items-start justify-between py-3 px-4 text-gray-700 cursor-pointer transition-all duration-200 rounded-lg",
      isSelected 
        ? "bg-[#F8BC40]/10 shadow-sm border border-[#F8BC40]/30" 
        : "hover:bg-white/80 border border-transparent hover:border-gray-200"
    )}
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-pressed={isSelected}
  >
    <div className="flex items-start pointer-events-none flex-1 min-w-0 mr-3">
      <Checkbox 
        checked={isSelected} 
        className="flex-shrink-0 mt-0.5"
        onClick={(e) => e.stopPropagation()}
      />
      <span className="font-medium ml-3 text-sm leading-tight" style={{ wordBreak: "break-word" }}>{name}</span>
    </div>
    {showPrice && price !== undefined && (
      <div className={cn(
        "pointer-events-none font-medium flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs whitespace-nowrap",
        isSelected ? "bg-[#F8BC40]/20 text-[#F8BC40]" : "bg-gray-100 text-gray-600"
      )}>
        ${price.toLocaleString()}
      </div>
    )}
  </div>
);

// Update the Van Visualization Component with loading state and effects
interface LayeredImageProps {
  view: ViewType;
  selectedWallColor: string;
  selectedCabinet: string;
  selectedCounter: string;
  hasBed: boolean;
  hasSeats: boolean;
}

const VanImageVisualization: React.FC<LayeredImageProps> = ({
  view,
  selectedWallColor,
  selectedCabinet,
  selectedCounter,
  hasBed,
  hasSeats
}) => {
  if (view !== 'interior') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <img src={emptyVan} alt="Van visualization" className="max-w-full max-h-full object-contain" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Base layer - Empty van */}
      <img
        src={emptyVan}
        alt="Empty van"
        className="absolute max-w-full max-h-full object-contain"
        style={{ zIndex: 1 }}
      />

      {/* Wall color layer */}
      {selectedWallColor && (
        <img
          src={selectedWallColor === 'wall-finished' ? finishedWall : whiteWall}
          alt="Wall color"
          className="absolute max-w-full max-h-full object-contain"
          style={{ zIndex: 2 }}
        />
      )}

      {/* Cabinet layer */}
      {selectedCabinet && (
        <img
          src={selectedCabinet === 'cabinet-painted' ? paintedCab : whiteCab}
          alt="Cabinets"
          className="absolute max-w-full max-h-full object-contain"
          style={{ zIndex: 3 }}
        />
      )}

      {/* Bed layer */}
      {hasBed && (
        <img
          src={bed}
          alt="Bed"
          className="absolute max-w-full max-h-full object-contain"
          style={{ zIndex: 4 }}
        />
      )}

      {/* Counter layer */}
      {selectedCounter && (
        <img
          src={
            selectedCounter === 'kitchen-countertop-maple'
              ? mapleCounter
              : selectedCounter === 'kitchen-countertop-teak'
              ? teakCounter
              : walnutCounter
          }
          alt="Counter"
          className="absolute max-w-full max-h-full object-contain"
          style={{ zIndex: 5 }}
        />
      )}

      {/* Seats layer */}
      {hasSeats && (
        <img
          src={frontSeats}
          alt="Front seats"
          className="absolute max-w-full max-h-full object-contain"
          style={{ zIndex: 6 }}
        />
      )}
    </div>
  );
};

interface Chassis {
  id: string;
  name: string;
  priceAdjustment: number;
}

interface Model {
  id: string;
  name: string;
  price: number;
}

// Add wall color options
const wallColorOptions = [
  { id: 'wall-finished', name: 'Finished', price: 2800 },
  { id: 'wall-white', name: 'White', price: 1500 },
];

export const VanBuilder: React.FC = () => {
  // Active category state - make it nullable to support closing drawers
  const [activeCategory, setActiveCategory] = useState<CategoryType | null>('chassis');
  
  // Completed categories
  const [completedCategories, setCompletedCategories] = useState<CategoryType[]>([]);
  
  // Active view state
  const [activeView, setActiveView] = useState<ViewType>('interior');
  
  // Configuration state
  const [selectedChassis, setSelectedChassis] = useState<Chassis | null>(null);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [hasVan, setHasVan] = useState(false);

  // Bed toggle state
  const [hasBed, setHasBed] = useState(false);
  
  // Selected cabinet color
  const [selectedCabinet, setSelectedCabinet] = useState<string>('');

  // Selected wall color
  const [selectedWallColor, setSelectedWallColor] = useState<string>('');

  // Selected counter
  const [selectedCounter, setSelectedCounter] = useState<string>('');

  // Seats visibility
  const [hasSeats, setHasSeats] = useState(true);

  // Predefined custom option lists for better state management
  const upholsteryOptions = [
    { id: 'upholstery-leather', name: 'Premium Leather', price: 3000 },
    { id: 'upholstery-fabric', name: 'Durable Fabric', price: 1500 },
    { id: 'upholstery-vinyl', name: 'Marine-Grade Vinyl', price: 2200 },
  ];
  
  const heatingOptions = [
    { id: 'heating-diesel', name: 'Diesel Heater System', price: 2500 },
    { id: 'heating-ac', name: 'Air Conditioning', price: 3500 },
  ];
  
  // Add these arrays with the other predefined option lists

  const exteriorOptions = [
    { id: 'exterior-awning', name: 'Feeama 45s Awning', price: 1695 },
    { id: 'exterior-awning-motorized', name: 'Feeama 45s Awning Motorized', price: 2195 },
    { id: 'exterior-roofrack', name: 'Flatline LowPro Roofrack', price: 1895 },
    { id: 'exterior-frontbumper', name: 'Flatline VanCo Front bumper', price: 1495 },
    { id: 'exterior-bullbar', name: 'Front BullBar', price: 995 },
    { id: 'exterior-skidplate', name: 'Skidplate', price: 795 },
    { id: 'exterior-winch', name: 'Warner VR Evo 12s Winch', price: 1295 },
    { id: 'exterior-rearbumper', name: 'Flatline Van Co Rearbumper', price: 1495 },
    { id: 'exterior-ladder', name: 'Sprinter Side Latter Wheel Wrap', price: 895 },
    { id: 'exterior-sidesteps', name: 'Sprinter Van Side Steps', price: 795 },
    { id: 'exterior-storagebox', name: 'Van Rear Storage Box', price: 995 },
    { id: 'exterior-platform', name: 'Sprinter Van Rear Door Platform', price: 895 }
  ];

  const bathroomOptions = [
    { id: 'bathroom-toilet', name: 'Composting Toilet', price: 1200 },
    { id: 'bathroom-shower', name: 'Indoor Shower System', price: 3500 },
    { id: 'bathroom-outdoorshower', name: 'Outdoor Shower', price: 650 }
  ];

  const kitchenOptions = [
    { id: 'kitchen-stove-mounted', name: '2 Burner Stove Mounted', price: 950 },
    { id: 'kitchen-stove-unmounted', name: '2 Burner Stove Unmounted', price: 850 },
    { id: 'kitchen-countertop-teak', name: 'Teak Countertop', price: 1200 },
    { id: 'kitchen-countertop-walnut', name: 'Walnut Countertop', price: 1100 },
    { id: 'kitchen-countertop-maple', name: 'Maple Countertop', price: 900 }
  ];

  const lightingOptions = [
    { id: 'lighting-premium', name: 'Premium Lighting', price: 1200 },
    { id: 'lighting-accent', name: 'Accent Lighting', price: 450 },
    { id: 'lighting-exterior', name: 'Exterior Lighting', price: 600 }
  ];

  const powerOptions = [
    { id: 'power-weekender', name: 'Weekender 300Ah', price: 3500 },
    { id: 'power-staycool', name: 'Stay Cool 400Ah', price: 4500 },
    { id: 'power-staycool-extender', name: 'Stay Cool Extender 600Ah', price: 6500 }
  ];

  // Price calculation functions
  const getUpgradesTotal = (): number => {
    return selectedOptions.reduce((total, optionId) => {
      // Check each option category
      const option = 
        upholsteryOptions.find(opt => opt.id === optionId) ||
        heatingOptions.find(opt => opt.id === optionId) ||
        exteriorOptions.find(opt => opt.id === optionId) ||
        bathroomOptions.find(opt => opt.id === optionId) ||
        kitchenOptions.find(opt => opt.id === optionId) ||
        lightingOptions.find(opt => opt.id === optionId) ||
        powerOptions.find(opt => opt.id === optionId) ||
        cabinetOptions.find(opt => opt.id === optionId) ||
        wallColorOptions.find(opt => opt.id === optionId) ||
        customizationOptions.find(opt => opt.id === optionId);

      return total + (option?.price || 0);
    }, 0);
  };

  const calculateTotal = (): number => {
    // Add chassis price (only if user doesn't have a van)
    let total = hasVan ? 0 : (selectedChassis?.priceAdjustment || 0);
    
    // Add base model price
    total += selectedModel?.price || 0;
    
    // Add customization options
    total += getUpgradesTotal();

    return total;
  };

  // Update total price when configuration changes
  useEffect(() => {
    setTotalPrice(calculateTotal());
  }, [selectedChassis, selectedModel, selectedColor, selectedOptions]);

  // Set initial default selection when component mounts
  useEffect(() => {
    // No default selections
  }, []);

  // Get vehicle chassis price (if chassis selected, otherwise 0)
  const getVehicleChassisPrice = (): number => {
    if (hasVan) return 0;
    if (selectedChassis) {
      return selectedChassis.priceAdjustment;
    }
    return 0;
  };

  // Custom model data that maps to our vanModels
  const modelPackages = [
    { id: 'sansaba', name: 'Sansaba Package', price: 49995, vanModelId: 'adventure' },
    { id: 'pedernales', name: 'Pedernales Package', price: 86995, vanModelId: 'expedition' },
    { id: 'riogrande', name: 'Rio Grande Package', price: 85995, vanModelId: 'adventure' }
  ];

  // Get base package price (if model selected, otherwise 0)
  const getBasePackagePrice = (): number => {
    if (selectedModel) {
      return selectedModel.price;
    }
    return 0;
  };

  // Handle chassis selection
  const handleChassisSelect = (chassisId: string) => {
    setSelectedChassis(chassisOptions.find(c => c.id === chassisId) || null);
    
    // Mark chassis as completed when selected but don't auto-advance
    if (!completedCategories.includes('chassis')) {
      setCompletedCategories(prev => Array.from(new Set([...prev, 'chassis'])));
    }
  };

  // Handle model selection
  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelPackages.find(m => m.id === modelId) || null);
    
    // Set default configuration for Sansaba package
    if (modelId === 'sansaba') {
      // Set wall color to finished
      setSelectedWallColor('wall-finished');
      
      // Set cabinets to white
      setSelectedCabinet('cabinet-white');
      
      // Set counter to maple
      setSelectedCounter('kitchen-countertop-maple');
      
      // Set bed to present
      setHasBed(true);
      
      // Update selected options to include all defaults
      setSelectedOptions([
        'wall-finished',
        'cabinet-white',
        'kitchen-countertop-maple'
      ]);
      
      // Mark relevant categories as completed
      setCompletedCategories(prev => Array.from(new Set([
        ...prev,
        'models',
        'wallcolor',
        'cabinets',
        'kitchen'
      ])));
    }
    
    // Mark models as completed when selected
    if (!completedCategories.includes('models')) {
      setCompletedCategories(prev => Array.from(new Set([...prev, 'models'])));
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    
    // Mark colors as completed when selected but don't auto-advance
    if (!completedCategories.includes('colors')) {
      setCompletedCategories(prev => Array.from(new Set([...prev, 'colors'])));
    }
  };

  // Handle option selection
  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions(prev => {
      const isSelected = prev.includes(optionId);
      
      if (isSelected) {
        // Remove the option
        const newOptions = prev.filter(id => id !== optionId);
        
        // Check if this was the last option in the current category
        const categoryOptions = getCategoryOptions(activeCategory as CategoryType);
        const hasSelectedOptionsInCategory = categoryOptions.some(opt => 
          newOptions.includes(opt.id)
        );
        
        // If no more options are selected in this category, remove it from completed
        if (!hasSelectedOptionsInCategory) {
          setCompletedCategories(prev => 
            prev.filter(cat => cat !== activeCategory)
          );
        }
        
        return newOptions;
      } else {
        // Add the option and mark category as completed
    if (!completedCategories.includes(activeCategory as CategoryType)) {
          setCompletedCategories(prev => Array.from(new Set([...prev, activeCategory as CategoryType])));
        }
        
        return [...prev, optionId];
      }
    });
  };

  // Helper function to get options for a specific category
  const getCategoryOptions = (category: CategoryType) => {
    switch (category) {
      case 'electrical':
        return customizationOptions.filter(opt => opt.category === 'Electrical');
      case 'upholstery':
        return upholsteryOptions;
      case 'heating':
        return heatingOptions;
      case 'exterior':
        return exteriorOptions;
      case 'bathroom':
        return bathroomOptions;
      case 'kitchen':
        return kitchenOptions;
      case 'lighting':
        return lightingOptions;
      case 'power':
        return powerOptions;
      case 'cabinets':
        return cabinetOptions;
      case 'wallcolor':
        return wallColorOptions;
      default:
        return [];
    }
  };

  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Render category content functions for each category
  const renderChassisOptions = () => (
    <div className="space-y-1 px-3">
      {chassisOptions.map(chassis => (
        <OptionItem 
          key={chassis.id} 
          isSelected={selectedChassis?.id === chassis.id}
          name={chassis.name}
          price={chassis.priceAdjustment}
          onClick={(e) => {
            e.stopPropagation();
            handleChassisSelect(chassis.id);
          }}
        />
      ))}
    </div>
  );

  const renderModelOptions = () => (
    <div className="space-y-1 px-3">
      {modelPackages.map(model => (
        <OptionItem 
              key={model.id}
          isSelected={selectedModel?.id === model.id}
          name={model.name}
          price={model.price}
          onClick={(e) => {
            e.stopPropagation();
            handleModelSelect(model.id);
          }}
        />
          ))}
        </div>
  );

  const renderColorOptions = () => (
    <div className="space-y-1 px-3">
      {colorOptions.map(color => (
        <OptionItem 
          key={color.id} 
          isSelected={selectedColor === color.id}
          name={color.name}
          onClick={(e) => {
            e.stopPropagation();
            handleColorSelect(color.id);
          }}
        />
          ))}
        </div>
  );

  const renderElectricalOptions = () => (
    <div className="space-y-1 px-3">
      {customizationOptions
        .filter(opt => opt.category === 'Electrical')
        .map(option => (
          <OptionItem 
            key={option.id} 
            isSelected={selectedOptions.includes(option.id)}
          name={option.name}
          price={option.price}
          onClick={(e) => {
            e.stopPropagation();
            handleOptionToggle(option.id);
          }}
        />
      ))}
    </div>
  );

  const renderUpholsteryOptions = () => (
    <div className="space-y-1 px-3">
      {upholsteryOptions.map(option => (
        <OptionItem 
          key={option.id} 
          isSelected={selectedOptions.includes(option.id)}
          name={option.name}
          price={option.price}
          onClick={(e) => {
            e.stopPropagation();
            handleOptionToggle(option.id);
          }}
        />
      ))}
    </div>
  );

  const renderHeatingOptions = () => (
    <div className="space-y-1 px-3">
      {heatingOptions.map(option => (
        <OptionItem 
          key={option.id} 
          isSelected={selectedOptions.includes(option.id)}
          name={option.name}
          price={option.price}
          onClick={(e) => {
            e.stopPropagation();
            handleOptionToggle(option.id);
          }}
        />
      ))}
    </div>
  );

  const renderExteriorOptions = () => (
    <div className="space-y-1 px-3">
      {exteriorOptions.map(option => (
        <OptionItem 
          key={option.id} 
          isSelected={selectedOptions.includes(option.id)}
          name={option.name}
          price={option.price}
          onClick={(e) => {
            e.stopPropagation();
            handleOptionToggle(option.id);
          }}
        />
      ))}
    </div>
  );

  const renderBathroomOptions = () => (
    <div className="space-y-1 px-3">
      {bathroomOptions.map(option => (
        <OptionItem 
          key={option.id} 
          isSelected={selectedOptions.includes(option.id)}
          name={option.name}
          price={option.price}
          onClick={(e) => {
            e.stopPropagation();
            handleOptionToggle(option.id);
          }}
        />
      ))}
    </div>
  );

  // Handle kitchen option selection
  const handleKitchenOptionSelect = (optionId: string) => {
    // Check if this is a countertop option
    const isCountertop = optionId.includes('kitchen-countertop-');
    
    if (isCountertop) {
      // If clicking the same countertop that's already selected, remove it
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(opt => opt !== optionId));
        setSelectedCounter(''); // Clear the counter selection
      } else {
        // Remove any existing countertop and add the new one
        const withoutCountertops = selectedOptions.filter(opt => !opt.includes('kitchen-countertop-'));
        setSelectedOptions([...withoutCountertops, optionId]);
        setSelectedCounter(optionId); // Set the new counter selection
      }
    } else {
      // Handle non-countertop options normally
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }

    // Mark kitchen category as completed if we have any selections
    if (!completedCategories.includes('kitchen')) {
      setCompletedCategories([...completedCategories, 'kitchen']);
    }
  };

  const renderKitchenOptions = () => (
    <div className="space-y-1 px-3">
      {kitchenOptions.map(option => (
        <OptionItem 
          key={option.id} 
          isSelected={selectedOptions.includes(option.id)}
          name={option.name}
          price={option.price}
          onClick={() => handleKitchenOptionSelect(option.id)}
        />
      ))}
    </div>
  );

  const renderLightingOptions = () => (
    <div className="space-y-1 px-3">
      {lightingOptions.map(option => (
        <OptionItem 
          key={option.id} 
          isSelected={selectedOptions.includes(option.id)}
          name={option.name}
          price={option.price}
          onClick={(e) => {
            e.stopPropagation();
            handleOptionToggle(option.id);
          }}
        />
      ))}
    </div>
  );

  const renderPowerOptions = () => (
    <div className="space-y-1 px-3">
      {powerOptions.map(option => (
        <OptionItem 
          key={option.id} 
          isSelected={selectedOptions.includes(option.id)}
          name={option.name}
          price={option.price}
          onClick={(e) => {
            e.stopPropagation();
            handleOptionToggle(option.id);
          }}
        />
      ))}
    </div>
  );

  // Cabinet selection handler
  const handleCabinetSelect = (cabinetId: string) => {
    // Remove any previous cabinet selection from options
    const filteredOptions = selectedOptions.filter(
      opt => !opt.includes('cabinet')
    );
    
    // Add the new cabinet selection
    setSelectedCabinet(cabinetId);
    console.log("Selected cabinet:", cabinetId); // Debug log
    
    setSelectedOptions([...filteredOptions, cabinetId]);
    
    // Mark the category as completed
    if (!completedCategories.includes('cabinets')) {
      setCompletedCategories([...completedCategories, 'cabinets']);
    }
  };

  // Render cabinet options
  const renderCabinetsOptions = () => (
    <div className="space-y-1 px-3">
      {cabinetOptions.map((cabinet) => (
        <OptionItem 
          key={cabinet.id}
          isSelected={selectedCabinet === cabinet.id}
          name={cabinet.name}
          price={cabinet.price}
          onClick={() => handleCabinetSelect(cabinet.id)}
        />
      ))}
    </div>
  );

  // Update the getVanImagePath function to use the cabinet images based on selection and bed toggle
  const getVanImagePath = () => {
    if (activeView === 'interior') {
      console.log("Current cabinet selection:", selectedCabinet, "Bed:", hasBed); // Debug log
      
      if (selectedCabinet === 'cabinet-white') {
        console.log("Using white cabinet image:", hasBed ? "with bed" : "no bed"); // Debug log
        return hasBed ? wcbImage : wcImage;
      } else if (selectedCabinet === 'cabinet-painted' || selectedCabinet === 'cabinet-alder') {
        console.log("Using painted/alder cabinet image:", hasBed ? "with bed" : "no bed"); // Debug log
        return hasBed ? gcbImage : gcImage;
      }
    }
    // Default to test image for other views
    return testImage;
  };

  // Add a fade transition when switching images
  const [imageOpacity, setImageOpacity] = useState(1);

  // Update this effect to animate view changes
  useEffect(() => {
    // Fade out
    setImageOpacity(0);
    
    // Fade in after a brief delay
    const timer = setTimeout(() => {
      setImageOpacity(1);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [activeView, selectedChassis?.id, selectedColor]);

  // Updated calculation function for progress percentage
  const calculateProgressPercentage = (): number => {
    // Count unique completed categories (no duplicates)
    const uniqueCompletedCategories = new Set(completedCategories);
    // Calculate as a percentage of total categories
    return Math.min(
      Math.round((uniqueCompletedCategories.size / CATEGORY_ORDER.length) * 100),
      100 // Ensure it doesn't exceed 100%
    );
  };

  // Add wall color selection handler
  const handleWallColorSelect = (wallColorId: string) => {
    // Remove any previous wall color selection from options
    const filteredOptions = selectedOptions.filter(
      opt => !opt.includes('wall-')
    );
    
    // Add the new wall color selection
    setSelectedWallColor(wallColorId);
    setSelectedOptions([...filteredOptions, wallColorId]);
    
    // Mark the category as completed
    if (!completedCategories.includes('wallcolor')) {
      setCompletedCategories([...completedCategories, 'wallcolor']);
    }
  };

  // Add render function for wall color options
  const renderWallColorOptions = () => (
    <div className="space-y-1 px-3">
      {wallColorOptions.map((wallColor) => (
        <OptionItem 
          key={wallColor.id}
          isSelected={selectedWallColor === wallColor.id}
          name={wallColor.name}
          price={wallColor.price}
          onClick={() => handleWallColorSelect(wallColor.id)}
        />
      ))}
    </div>
  );

  // Function to determine if a category should be locked
  const isCategoryLocked = (category: CategoryType): boolean => {
    switch (category) {
      case 'chassis':
        return false; // Always unlocked
      case 'models':
        return !selectedChassis; // Locked until chassis is selected
      case 'wallcolor':
        return !selectedModel; // Locked until model is selected
      case 'colors':
        return !selectedModel; // Locked until model is selected
      case 'cabinets':
        return !selectedModel; // Locked until model is selected
      case 'upholstery':
        return !selectedModel; // Locked until model is selected
      case 'electrical':
        return !selectedModel; // Locked until model is selected
      case 'heating':
        return !selectedModel; // Locked until model is selected
      case 'exterior':
        return !selectedModel; // Locked until model is selected
      case 'bathroom':
        return !selectedModel; // Locked until model is selected
      case 'kitchen':
        return !selectedModel; // Locked until model is selected
      case 'lighting':
        return !selectedModel; // Locked until model is selected
      case 'power':
        return !selectedModel; // Locked until model is selected
      default:
        return true;
    }
  };

  return (
    <div className="flex flex-col min-h-screen h-screen bg-gradient-to-br from-[#FDF8E2] via-white to-[#FCEFCA] text-gray-800 font-['Open_Sans'] fixed inset-0 overflow-hidden">
      <GlobalStyles />
      
      {/* Main content section with improved spacing and layout */}
      <div className="flex flex-1 overflow-hidden p-8 gap-8">
        {/* Left sidebar - Categories */}
        <div className="w-[360px] flex flex-col overflow-hidden rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm self-center border border-gray-100/50" style={{ height: "580px" }}>
          {/* Title with improved styling */}
          <div className="py-5 px-6 sticky top-0 z-10 bg-gradient-to-r from-white to-[#FDF8E2] border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5 text-[#F8BC40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              Customize Your Van
            </h2>
            <p className="text-gray-500 text-sm mt-1.5 ml-8.5">Select options to build your dream van</p>
          </div>
          
          {/* Categories with improved scrolling and spacing */}
          <div className="overflow-y-auto custom-scrollbar flex-1 py-4 space-y-1.5">
            {CATEGORY_ORDER.map((category) => {
              const isLocked = isCategoryLocked(category);
              return (
                <div key={category}>
                  <Category 
                    title={category === 'chassis' ? 'Vehicle Chassis' : 
                           category === 'electrical' ? 'Electrical & Connectivity' :
                           category === 'heating' ? 'Heating & Cooling' :
                           category === 'exterior' ? 'Exterior Features' :
                           category === 'bathroom' ? 'Bathroom Options' :
                           category === 'kitchen' ? 'Kitchen Features' :
                           category === 'lighting' ? 'Lighting Systems' :
                           category === 'power' ? 'Power Systems' :
                           category === 'cabinets' ? 'Cabinet Options' :
                           category === 'wallcolor' ? 'Wall Color' :
                           category.charAt(0).toUpperCase() + category.slice(1)}
                    isActive={activeCategory === category}
                    isCompleted={completedCategories.includes(category)}
                    isLocked={isLocked}
                    onClick={() => {
                      if (activeCategory === category) {
                        setActiveCategory(null);
                      } else {
                        setActiveCategory(category);
                      }
                    }}
                  />
                  
                  {/* Only render options drawer if category is not locked and is active */}
                  {activeCategory === category && !isLocked && (
                    <div className="transition-all duration-300 ease-in-out overflow-hidden">
                      <div className="pt-2 pb-3">
                        {/* Render the appropriate options based on category */}
                        {category === 'chassis' && renderChassisOptions()}
                        {category === 'models' && renderModelOptions()}
                        {category === 'wallcolor' && renderWallColorOptions()}
                        {category === 'colors' && renderColorOptions()}
                        {category === 'cabinets' && renderCabinetsOptions()}
                        {category === 'upholstery' && renderUpholsteryOptions()}
                        {category === 'electrical' && renderElectricalOptions()}
                        {category === 'heating' && renderHeatingOptions()}
                        {category === 'exterior' && renderExteriorOptions()}
                        {category === 'bathroom' && renderBathroomOptions()}
                        {category === 'kitchen' && renderKitchenOptions()}
                        {category === 'lighting' && renderLightingOptions()}
                        {category === 'power' && renderPowerOptions()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Configuration progress bar as part of normal flow */}
          <div className="p-4 bg-white/95 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-gray-800">Configuration Progress</span>
              </div>
              <span className="font-medium text-green-600">
                {calculateProgressPercentage()}%
              </span>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${calculateProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Center - Van Visualization with improved styling */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden rounded-2xl mx-6">
          {/* Subtle border and backdrop effect */}
          <div className="absolute inset-0 border border-white/30 rounded-2xl backdrop-blur-[1px]"></div>
          
          {/* Toggle controls with improved styling */}
          <div className="absolute top-6 left-0 right-0 mx-auto z-10 flex flex-col items-center gap-4">
            {selectedCabinet && (
              <div className="flex items-center gap-6 bg-white/95 backdrop-blur-sm shadow-md p-3 rounded-lg border border-gray-100/50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Toggle Bed</span>
                  <Switch 
                    checked={hasBed} 
                    onCheckedChange={setHasBed} 
                    id="bed-toggle" 
                  />
                </div>
                <div className="w-px h-6 bg-gray-200"></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Toggle Seats</span>
                  <Switch 
                    checked={hasSeats} 
                    onCheckedChange={setHasSeats} 
                    id="seats-toggle" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Van visualization with improved scaling and positioning */}
          <div className="absolute inset-0 flex items-center justify-center pt-24 pb-24">
            <VanImageVisualization
              view="interior"
              selectedWallColor={selectedWallColor}
              selectedCabinet={selectedCabinet}
              selectedCounter={selectedCounter}
              hasBed={hasBed}
              hasSeats={hasSeats}
            />
          </div>
        </div>

        {/* Right sidebar - Price summary with improved styling */}
        <div className="w-[360px] flex flex-col overflow-hidden rounded-2xl shadow-lg bg-white/95 backdrop-blur-sm self-center border border-gray-100/50" style={{ height: "580px" }}>
          <div className="py-5 px-6 bg-gradient-to-r from-white to-[#FDF8E2] border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2.5 text-[#F8BC40]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Price Breakdown
            </h2>
          </div>

          {/* Van ownership toggle */}
          <div className="px-5 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">I already have a van</span>
              <Switch 
                id="van-ownership" 
                checked={hasVan}
                onCheckedChange={setHasVan}
              />
            </div>
          </div>

          {/* Price cards with adjusted spacing */}
          <div className="flex-1 p-4 space-y-4 flex flex-col">
            <div className="space-y-4 flex-1">
              <div className={cn(
                "flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[80px]",
                hasVan && "opacity-60 bg-gray-50"
              )}>
                <span className={cn(
                  "text-gray-700 font-medium",
                  hasVan && "line-through text-gray-400"
                )}>Chassis:</span>
                <div className="flex flex-col items-end">
                  <span className={cn(
                    "font-medium text-sm",
                    hasVan ? "text-gray-400" : "text-gray-600"
                  )}>
                    {hasVan ? (
                      <span className="text-gray-400">Personal Van</span>
                    ) : (
                      selectedChassis?.name || 
                      <span className="text-gray-400">Not selected</span>
                    )}
                  </span>
                  <span className={cn(
                    "font-semibold text-lg mt-0.5",
                    hasVan ? "text-gray-400 line-through" : "text-[#F8BC40]"
                  )}>
                    ${getVehicleChassisPrice().toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[80px]">
                <span className="text-gray-700 font-medium">Base Package:</span>
                <div className="flex flex-col items-end">
                  <span className="font-medium text-sm text-gray-600">
                    {selectedModel?.name || 
                      <span className="text-gray-400">Not selected</span>}
                  </span>
                  <span className="font-semibold text-[#F8BC40] text-lg mt-0.5">
                    ${getBasePackagePrice().toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[80px]">
                <span className="text-gray-700 font-medium">Upgrades:</span>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-600">{selectedOptions.length} items selected</span>
                  <span className="font-semibold text-[#F8BC40] text-lg mt-0.5">
                    ${getUpgradesTotal().toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="p-5 bg-[#F8BC40]/10 rounded-xl border border-[#F8BC40]/20">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-xl">Total:</span>
                  <span className="font-bold text-2xl text-[#F8BC40]">
                    ${calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Action button with adjusted margin */}
              <div className="mt-auto">
                <Button
                  className="w-full bg-[#F8BC40] hover:bg-[#E6AB30] text-white font-semibold py-6 transition-colors duration-200 rounded-xl shadow-md flex items-center justify-center gap-2 text-base"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  <span>Let's Build Your Van!</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Updated EmailModal with proper props */}
      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        selectedChassis={selectedChassis}
        selectedModel={selectedModel}
        selectedColor={selectedColor}
        selectedOptions={selectedOptions}
        totalPrice={totalPrice}
        getUpgradesTotal={getUpgradesTotal}
        calculateTotal={calculateTotal}
        upholsteryOptions={upholsteryOptions}
        heatingOptions={heatingOptions}
        customizationOptions={customizationOptions}
      />
    </div>
  );
};