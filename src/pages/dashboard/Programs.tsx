import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, DollarSign, GraduationCap, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProfileCompletionModal from '@/components/ProfileCompletionModal';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface Program {
  id: string;
  name_id: string;
  description_id: string;
  university_id: string;
  tuition_fee: number;
  currency: string;
  application_deadline: string;
  study_levels: string[];
  languages: string[];
  intake_dates: string[];
  is_active: boolean;
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isComplete, completionPercentage, shouldShowModal } = useProfileCompletion();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('is_active', true)
        .order('tuition_fee');

      if (error) throw error;
      setPrograms(data || []);
    } catch (error: any) {
      console.error('Error fetching programs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockPrograms = [
    {
      id: '1',
      name: 'Computer Science',
      university: 'MIT',
      country: 'United States',
      level: 'Bachelor',
      duration: '4 years',
      tuition: '$55,000',
      currency: 'USD',
      deadline: '2024-12-01',
      languages: ['English'],
      intakes: ['Fall', 'Spring'],
      description: 'Comprehensive program covering algorithms, software engineering, and AI.'
    },
    {
      id: '2',
      name: 'Business Administration',
      university: 'London Business School',
      country: 'United Kingdom',
      level: 'Master',
      duration: '2 years',
      tuition: '£45,000',
      currency: 'GBP',
      deadline: '2024-11-15',
      languages: ['English'],
      intakes: ['September'],
      description: 'MBA program focused on global business leadership and innovation.'
    },
    {
      id: '3',
      name: 'Mechanical Engineering',
      university: 'ETH Zurich',
      country: 'Switzerland',
      level: 'Bachelor',
      duration: '3 years',
      tuition: 'CHF 1,200',
      currency: 'CHF',
      deadline: '2024-04-30',
      languages: ['German', 'English'],
      intakes: ['Autumn'],
      description: 'World-class engineering program with strong industry connections.'
    },
    {
      id: '4',
      name: 'International Relations',
      university: 'Sciences Po',
      country: 'France',
      level: 'Bachelor',
      duration: '3 years',
      tuition: '€13,000',
      currency: 'EUR',
      deadline: '2024-06-01',
      languages: ['French', 'English'],
      intakes: ['September'],
      description: 'Interdisciplinary program in politics, economics, and international affairs.'
    }
  ];

  const handleApplyNow = (programId: string) => {
    if (!isComplete && shouldShowModal) {
      setShowProfileModal(true);
    } else {
      // Navigate to application form
      console.log('Apply to program:', programId);
    }
  };

  if (loading) {
    return <div>Loading programs...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Study Programs</h1>
        <p className="text-muted-foreground">
          Discover academic programs from top universities worldwide
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search programs, universities, or fields..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Button>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Study Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="bachelor">Bachelor</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="de">Germany</SelectItem>
                  <SelectItem value="fr">France</SelectItem>
                  <SelectItem value="ch">Switzerland</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Program Name</SelectItem>
                  <SelectItem value="tuition-low">Tuition (Low to High)</SelectItem>
                  <SelectItem value="tuition-high">Tuition (High to Low)</SelectItem>
                  <SelectItem value="deadline">Application Deadline</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockPrograms.map((program) => (
          <Card key={program.id} className="hover:shadow-soft transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{program.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <span>{program.university}</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{program.country}</span>
                    </div>
                  </CardDescription>
                </div>
                <Badge variant="secondary">{program.level}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {program.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-semibold">{program.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Tuition</p>
                      <p className="font-semibold">{program.tuition}/year</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Application Deadline: {new Date(program.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {program.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                    {program.intakes.map((intake) => (
                      <Badge key={intake} variant="outline" className="text-xs">
                        {intake} Intake
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1" 
                    onClick={() => handleApplyNow(program.id)}
                  >
                    Apply Now
                  </Button>
                  <Button variant="outline" size="sm">
                    Learn More
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
          Load More Programs
        </Button>
      </div>

      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        completionPercentage={completionPercentage}
        action="apply"
      />
    </div>
  );
};

export default Programs;