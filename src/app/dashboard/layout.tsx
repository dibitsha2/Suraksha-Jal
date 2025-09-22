

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
import Image from 'next/image';
import {
  Home,
  Stethoscope,
  LogOut,
  User,
  Menu,
  Settings,
  Shield,
  Pill,
  HeartPulse,
  Bell,
  Info,
  Droplet,
  Globe,
  Siren,
  FilePlus,
  Languages,
  BarChart2,
  MessageCircle,
  FileScan,
  Moon,
  Sun,
  Check,
} from 'lucide-react';
import { SurakshaJalLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { useLanguage } from '@/hooks/use-language';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: Home, label: t('dashboard') },
    { href: '/dashboard/symptom-checker', icon: Stethoscope, label: t('symptomChecker') },
    { href: '/dashboard/medication-suggester', icon: Pill, label: t('medicationSuggester')},
    { href: '/dashboard/medicine-checker', icon: Info, label: t('medicineChecker')},
    { href: '/dashboard/prescription-reader', icon: FileScan, label: 'Prescription Reader'},
    { href: '/dashboard/water-quality', icon: Droplet, label: t('waterQuality') },
    { href: '/dashboard/precautions', icon: Shield, label: t('precautions') },
    { href: '/dashboard/health-reminders', icon: HeartPulse, label: t('healthReminders') },
    { href: '/dashboard/reminders', icon: Bell, label: t('reminders') },
    { href: '/dashboard/local-reports', icon: Globe, label: t('reports') },
    { href: '/dashboard/emergency-contacts', icon: Siren, label: 'Emergency Contacts' },
    { href: '/dashboard/settings', icon: Settings, label: 'Language Settings' },
  ];

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
            <SurakshaJalLogo className="h-6 w-6 text-primary" />
            <span className="">Suraksha Jal</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === item.href && 'bg-primary/10 text-primary'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

function Header() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const navItems = [
    { href: '/dashboard', icon: Home, label: t('dashboard') },
    { href: '/dashboard/symptom-checker', icon: Stethoscope, label: t('symptomChecker') },
    { href: '/dashboard/medication-suggester', icon: Pill, label: t('medicationSuggester')},
    { href: '/dashboard/medicine-checker', icon: Info, label: t('medicineChecker')},
    { href: '/dashboard/prescription-reader', icon: FileScan, label: 'Prescription Reader'},
    { href: '/dashboard/water-quality', icon: Droplet, label: t('waterQuality') },
    { href: '/dashboard/precautions', icon: Shield, label: t('precautions') },
    { href: '/dashboard/health-reminders', icon: HeartPulse, label: t('healthReminders') },
    { href: '/dashboard/reminders', icon: Bell, label: t('reminders') },
    { href: '/dashboard/local-reports', icon: Globe, label: t('reports') },
    { href: '/dashboard/emergency-contacts', icon: Siren, label: 'Emergency Contacts' },
    { href: '/dashboard/settings', icon: Settings, label: 'Language Settings' },
  ];
  
  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
              <SurakshaJalLogo className="h-6 w-6 text-primary" />
              <span className="font-headline">Suraksha Jal</span>
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                  pathname === item.href && 'bg-muted text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        {/* Can add a search bar here if needed */}
      </div>
      
      <div className="flex items-center gap-4">
        <UserMenu />
      </div>

    </header>
  );
}

function UserMenu() {
    const { t } = useLanguage();
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = React.useState<any>(null);
    const { theme, setTheme } = useTheme();

    const loadProfile = (currentUser: any) => {
        if (!currentUser) {
            setUser(null);
            return;
        }
        try {
            const userProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
            const localProfile = userProfiles[currentUser.uid] || {};
            
            const combinedUser = {
                uid: currentUser.uid,
                displayName: localProfile.name || currentUser.displayName,
                photoURL: currentUser.photoURL, // Always prefer Firebase Auth photoURL
            };
            setUser(combinedUser);
        } catch (e) {
            console.error("Failed to load user profile from local storage", e);
            setUser(currentUser); 
        }
    }

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(loadProfile);
        
        const handleProfileUpdate = () => {
            if (auth.currentUser) {
                loadProfile(auth.currentUser);
            }
        };
        window.addEventListener('profileUpdated', handleProfileUpdate);

        return () => {
            unsubscribe();
            window.removeEventListener('profileUpdated', handleProfileUpdate);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            router.push('/auth/login');
            toast({
                title: 'Logged Out',
                description: 'You have been successfully logged out.',
            });
        } catch (error) {
            console.error('Logout error:', error);
            toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: 'Could not log you out. Please try again.',
            });
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                     <Avatar className="h-8 w-8">
                        {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                        <AvatarFallback>
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                        </AvatarFallback>
                     </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.displayName || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                                <Check className={cn("mr-2 h-4 w-4", theme === 'light' ? "opacity-100" : "opacity-0")} />
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                                <Check className={cn("mr-2 h-4 w-4", theme === 'dark' ? "opacity-100" : "opacity-0")} />
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('system')}>
                                 <Check className={cn("mr-2 h-4 w-4", theme === 'system' ? "opacity-100" : "opacity-0")} />
                                System
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

    
