import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, ExternalLink, Star, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProfileCompletionModal from '@/components/ProfileCompletionModal';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface University {
  id: string;
  name: string;
  country_id: string;
  website_url: string;
  logo_url: string;
  is_active: boolean;
}

const Universities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isComplete, completionPercentage, shouldShowModal } = useProfileCompletion();

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    filterUniversities();
  }, [searchQuery, selectedCountry, universities]);

  const fetchUniversities = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setUniversities(data || []);
    } catch (error: any) {
      console.error('Error fetching universities:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterUniversities = () => {
    let filtered = universities;

    if (searchQuery) {
      filtered = filtered.filter(uni =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(uni => uni.country_id === selectedCountry);
    }

    setFilteredUniversities(filtered);
  };

  // Mock data for demonstration (since we don't have all the relations set up)
  const mockUniversityData = [
    {
      id: '1',
      name: 'Harvard University',
      country: 'United States',
      programs: 145,
      students: '21,000+',
      ranking: '#1 Global',
      website: 'https://harvard.edu',
      logo: '',
      description: 'Leading research university with world-class programs across all disciplines.'
    },
    {
      id: '2',
      name: 'University of Oxford',
      country: 'United Kingdom',
      programs: 120,
      students: '24,000+',
      ranking: '#2 Global',
      website: 'https://ox.ac.uk',
      logo: '',
      description: 'One of the oldest and most prestigious universities in the English-speaking world.'
    },
    {
      id: '3',
      name: 'MIT',
      country: 'United States',
      programs: 95,
      students: '11,000+',
      ranking: '#3 Engineering',
      website: 'https://mit.edu',
      logo: '',
      description: 'Leading institution for technology, engineering, and scientific research.'
    }
  ];

  if (loading) {
    return <div>Loading universities...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Universities</h1>
        <p className="text-muted-foreground">
          Explore top universities worldwide and find your perfect match
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* University Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUniversityData.map((university) => (
          <Card key={university.id} className="hover:shadow-soft transition-all duration-300">
            <CardHeader>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                  {university.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{university.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{university.country}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {university.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1" />
                    {university.ranking}
                  </Badge>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {university.students}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Programs</p>
                    <p className="font-semibold">{university.programs}+</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Students</p>
                    <p className="font-semibold">{university.students}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      if (!isComplete && shouldShowModal) {
                        setShowProfileModal(true);
                      } else {
                        // Navigate to programs page with filter
                        console.log('View programs for:', university.name);
                      }
                    }}
                  >
                    View Programs
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={university.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline">
          Load More Universities
        </Button>
      </div>

      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        completionPercentage={completionPercentage}
        action="search"
      />
    </div>
  );
};

export default Universities;