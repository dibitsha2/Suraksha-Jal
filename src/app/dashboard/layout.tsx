

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
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { useLanguage } from '@/hooks/use-language';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { auth } from '@/lib/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';


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
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
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
    { href: '/dashboard/water-quality', icon: Droplet, label: t('waterQuality') },
    { href: '/dashboard/medication-suggester', icon: Pill, label: t('medicationSuggester') },
    { href: '/dashboard/medicine-checker', icon: Info, label: t('medicineChecker') },
    { href: '/dashboard/precautions', icon: Shield, label: t('precautions') },
    { href: '/dashboard/health-reminders', icon: HeartPulse, label: t('healthReminders') },
    { href: '/dashboard/reminders', icon: Bell, label: t('reminders') },
    { href: '/dashboard/local-reports', icon: Globe, label: t('reports') },
    { href: '/dashboard/emergency-contacts', icon: Siren, label: 'Emergency Contacts' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
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
        <div className="flex-1 overflow-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'
                }`}
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
    { href: '/dashboard/water-quality', icon: Droplet, label: t('waterQuality') },
    { href: '/dashboard/medication-suggester', icon: Pill, label: t('medicationSuggester') },
    { href: '/dashboard/medicine-checker', icon: Info, label: t('medicineChecker') },
    { href: '/dashboard/precautions', icon: Shield, label: t('precautions') },
    { href: '/dashboard/health-reminders', icon: HeartPulse, label: t('healthReminders') },
    { href: '/dashboard/reminders', icon: Bell, label: t('reminders') },
    { href: '/dashboard/local-reports', icon: Globe, label: t('reports') },
    { href: '/dashboard/emergency-contacts', icon: Siren, label: 'Emergency Contacts' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
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
                className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                  pathname === item.href ? 'bg-muted text-foreground' : 'text-muted-foreground'
                }`}
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

      <UserMenu />
    </header>
  );
}

function UserMenu() {
    const { t, setLanguage } = useLanguage();
    const router = useRouter();
    const { toast } = useToast();
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const handleAuthChange = (currentUser: any) => {
            if (currentUser) {
                // User is signed in.
                const allProfiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
                const storedProfile = allProfiles[currentUser.email!];
                
                const updatedProfile = {
                    ...(storedProfile || {}),
                    name: storedProfile?.name || currentUser.displayName,
                    email: currentUser.email,
                    photoURL: storedProfile?.photoURL || currentUser.photoURL,
                };
                
                setUser(updatedProfile);
                localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                allProfiles[currentUser.email!] = updatedProfile;
                localStorage.setItem('userProfiles', JSON.stringify(allProfiles));


            } else {
                // User is signed out.
                setUser(null);
            }
        };

        const unsubscribe = auth.onAuthStateChanged(handleAuthChange);
        
        // Also set user from local storage on initial load
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
            try {
                setUser(JSON.parse(storedProfile));
            } catch (e) {
                 console.error("Error parsing user profile on initial load", e);
            }
        }

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            localStorage.removeItem('userProfile');
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
                        {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.name || 'User'} />}
                        <AvatarFallback>
                            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                        </AvatarFallback>
                     </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('profile')}</span>
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0">
                    <div className="flex items-center justify-between w-full px-2 py-1.5">
                       <span>Theme</span>
                       <ThemeToggle />
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
