import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, GraduationCap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentProfile {
  id: string;
  user_id: string;
  current_study_level: string;
  country_of_origin: string;
  country_of_birth: string;
  current_country: string;
  has_dual_citizenship: boolean;
  puan_or_average_grade: number;
}

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  language_preference: string;
}

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user data
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      // Fetch student profile
      const { data: studentProfile, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (studentError) throw studentError;

      setUserData(userProfile);
      setStudentData(studentProfile);
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userData || !studentData) return;

    setSaving(true);
    try {
      // Update user data
      const { error: userError } = await supabase
        .from('users')
        .update({
          first_name: userData.first_name,
          last_name: userData.last_name,
          language_preference: userData.language_preference,
        })
        .eq('id', userData.id);

      if (userError) throw userError;

      // Update student data
      const { error: studentError } = await supabase
        .from('students')
        .update({
          current_study_level: studentData.current_study_level,
          country_of_origin: studentData.country_of_origin,
          country_of_birth: studentData.country_of_birth,
          current_country: studentData.current_country,
          has_dual_citizenship: studentData.has_dual_citizenship,
          puan_or_average_grade: studentData.puan_or_average_grade,
        })
        .eq('user_id', studentData.user_id);

      if (studentError) throw studentError;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Photo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-lg">
                {userData?.first_name?.charAt(0)}{userData?.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={userData?.first_name || ''}
                  onChange={(e) => setUserData(prev => prev ? {...prev, first_name: e.target.value} : null)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={userData?.last_name || ''}
                  onChange={(e) => setUserData(prev => prev ? {...prev, last_name: e.target.value} : null)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={userData?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select
                value={userData?.language_preference || 'en'}
                onValueChange={(value) => setUserData(prev => prev ? {...prev, language_preference: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="tr">Turkish</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Academic Information</span>
          </CardTitle>
          <CardDescription>
            Your educational background and academic details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studyLevel">Current Study Level</Label>
              <Select
                value={studentData?.current_study_level || ''}
                onValueChange={(value) => setStudentData(prev => prev ? {...prev, current_study_level: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select study level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="averageGrade">Average Grade/Score</Label>
              <Input
                id="averageGrade"
                type="number"
                value={studentData?.puan_or_average_grade || ''}
                onChange={(e) => setStudentData(prev => prev ? {...prev, puan_or_average_grade: parseFloat(e.target.value)} : null)}
                placeholder="Enter your average grade"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Location Information</span>
          </CardTitle>
          <CardDescription>
            Your geographical and citizenship details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthCountry">Country of Birth</Label>
              <Input
                id="birthCountry"
                value={studentData?.country_of_birth || ''}
                onChange={(e) => setStudentData(prev => prev ? {...prev, country_of_birth: e.target.value} : null)}
                placeholder="Enter country of birth"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="originCountry">Country of Origin</Label>
              <Input
                id="originCountry"
                value={studentData?.country_of_origin || ''}
                onChange={(e) => setStudentData(prev => prev ? {...prev, country_of_origin: e.target.value} : null)}
                placeholder="Enter country of origin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentCountry">Current Country</Label>
              <Input
                id="currentCountry"
                value={studentData?.current_country || ''}
                onChange={(e) => setStudentData(prev => prev ? {...prev, current_country: e.target.value} : null)}
                placeholder="Enter current country"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="dualCitizenship"
              checked={studentData?.has_dual_citizenship || false}
              onChange={(e) => setStudentData(prev => prev ? {...prev, has_dual_citizenship: e.target.checked} : null)}
              className="rounded border-input"
            />
            <Label htmlFor="dualCitizenship">I have dual citizenship</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;