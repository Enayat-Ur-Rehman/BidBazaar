
import { LayoutDashboard, Gavel, FileText, Users, DollarSign, Settings, Package, BarChart3, User, Eye,PlusCircle,Info,HelpCircle, CreditCard} from 'lucide-react';

const sidebarRoutes = {
  // Common routes for all users
  common: [
    { 
      href: '/auctions', 
      label: 'Auctions', 
      icon: Gavel 
    },
    { 
      href: '/leaderboard', 
      label: 'Leaderboard', 
      icon: BarChart3 
    },
  ],
  
  // Super Admin specific routes
  superAdmin: [
    { 
      href: '/dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard 
    },
  ],
  
  // Auctioneer specific routes
  auctioneer: [
    { 
      href: '/submit-commission', 
      label: 'Submit Commission', 
      icon: DollarSign 
    },
    { 
      href: '/create-auction', 
      label: 'Create Auction', 
      icon: PlusCircle 
    },
    { 
      href: '/view-my-auctions', 
      label: 'View My Auctions', 
      icon: Eye 
    },
  ],
  
  // Bidder specific routes 
  bidder: [
    { href: '/bidder/myBids', label: 'My Bids', icon: FileText },
    { href: '/bidder/myPayments', label: 'My Payments', icon: CreditCard },
    { href: '/bidder/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ],

  // Secondary navigation (always visible)
  secondary: [
    { 
      href: '/how-it-works-info', 
      label: 'How it works', 
      icon: HelpCircle 
    },
    { 
      href: '/about', 
      label: 'About Us', 
      icon: Info 
    },
  ],
  
  // Profile route (visible when authenticated)
  profile: [
    { 
      href: '/me', 
      label: 'Profile', 
      icon: User 
    },
  ],
};

export default sidebarRoutes;