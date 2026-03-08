import { Layout } from "@/components/layout/Layout";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <Layout>
      <div className="container px-4 py-8 md:py-12 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-16 w-16 border-2 border-accent">
            <AvatarFallback className="bg-accent text-accent-foreground text-xl font-bold">JS</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">John Smith</h1>
            <p className="text-sm text-muted-foreground">john@example.com · Member since Mar 2026</p>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full justify-start bg-transparent border-b rounded-none p-0 h-auto overflow-x-auto">
            {[
              { value: "profile", label: "Profile", icon: User },
              { value: "orders", label: "Orders", icon: Package },
              { value: "wishlist", label: "Wishlist", icon: Heart },
              { value: "settings", label: "Settings", icon: Settings },
            ].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-1.5 text-xs">
                <tab.icon className="h-3.5 w-3.5" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="profile" className="pt-6">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label className="text-xs">First Name</Label><Input defaultValue="John" /></div>
                <div className="space-y-2"><Label className="text-xs">Last Name</Label><Input defaultValue="Smith" /></div>
              </div>
              <div className="space-y-2"><Label className="text-xs">Email</Label><Input defaultValue="john@example.com" type="email" /></div>
              <div className="space-y-2"><Label className="text-xs">Phone</Label><Input defaultValue="+91 98765 43210" /></div>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">Save Changes</Button>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 mt-4 space-y-4">
              <h3 className="font-semibold text-sm">Change Password</h3>
              <div className="space-y-2"><Label className="text-xs">Current Password</Label><Input type="password" /></div>
              <div className="space-y-2"><Label className="text-xs">New Password</Label><Input type="password" /></div>
              <Button variant="outline" className="rounded-full">Update Password</Button>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="pt-6">
            <p className="text-muted-foreground text-sm mb-4">Your recent orders:</p>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/orders">View All Orders</Link>
            </Button>
          </TabsContent>

          <TabsContent value="wishlist" className="pt-6">
            <p className="text-muted-foreground text-sm">Your wishlist is empty.</p>
          </TabsContent>

          <TabsContent value="settings" className="pt-6">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-sm mb-3">Preferences</h3>
                <p className="text-sm text-muted-foreground">Notification and display preferences coming soon.</p>
              </div>
              <Button variant="destructive" className="rounded-full gap-2"><LogOut className="h-4 w-4" /> Sign Out</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </Layout>
  );
};

export default Profile;
