import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, DollarSign, GraduationCap, School, FileText, MessageSquare } from 'lucide-react';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'programs' | 'universities'>('programs');

  // Mock data for featured programs and universities
  const featuredPrograms = [
    {
      id: 1,
      name: 'Computer Science',
      university: 'Tech University',
      country: 'USA',
      tuition: '$45,000',
      duration: '4 years',
      deadline: '2024-05-01'
    },
    {
      id: 2,
      name: 'Business Administration',
      university: 'Business School',
      country: 'UK',
      tuition: '£35,000',
      duration: '3 years',
      deadline: '2024-06-15'
    }
  ];

  const featuredUniversities = [
    {
      id: 1,
      name: 'Tech University',
      country: 'USA',
      ranking: '#15 Global',
      programs: 120
    },
    {
      id: 2,
      name: 'Business School',
      country: 'UK',
      ranking: '#8 Business',
      programs: 85
    }
  ];

  const recentApplications = [
    {
      id: 1,
      program: 'Computer Science',
      university: 'Tech University',
      status: 'Under Review',
      submittedDate: '2024-01-15'
    },
    {
      id: 2,
      program: 'Data Science',
      university: 'Data Institute',
      status: 'Accepted',
      submittedDate: '2024-01-10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-lg p-6 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard</h1>
        <p className="text-primary-foreground/90">
          Discover your dream university and program. Start your journey to international education.
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Programs & Universities</span>
          </CardTitle>
          <CardDescription>
            Find the perfect program or university for your international education
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex space-x-2">
              <Button 
                variant={searchType === 'programs' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSearchType('programs')}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Programs
              </Button>
              <Button 
                variant={searchType === 'universities' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSearchType('universities')}
              >
                <School className="h-4 w-4 mr-2" />
                Universities
              </Button>
            </div>
            <div className="flex flex-1 space-x-2">
              <Input
                placeholder={`Search for ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Featured Programs */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Programs</CardTitle>
            <CardDescription>Popular programs you might be interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredPrograms.map((program) => (
                <div key={program.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{program.name}</h3>
                    <Badge variant="secondary">{program.tuition}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{program.university}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{program.country}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{program.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Track your application status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{app.program}</h3>
                      <p className="text-muted-foreground text-sm">{app.university}</p>
                    </div>
                    <Badge 
                      variant={app.status === 'Accepted' ? 'default' : 
                              app.status === 'Under Review' ? 'secondary' : 'outline'}
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(app.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <School className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Universities</p>
                <p className="text-2xl font-bold">150+</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Programs</p>
                <p className="text-2xl font-bold">500+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;