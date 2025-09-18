import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Plus,
  Eye,
  Download,
  Upload,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProfileCompletionModal from '@/components/ProfileCompletionModal';
import { useProfileCompletion } from '@/hooks/useProfileCompletion';

interface Application {
  id: string;
  student_id: string;
  program_id: string;
  status: string;
  application_data: any;
  submitted_at: string;
}

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { isComplete, completionPercentage, shouldShowModal } = useProfileCompletion();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('student_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      console.error('Error fetching applications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const mockApplications = [
    {
      id: '1',
      program: 'Computer Science',
      university: 'MIT',
      country: 'United States',
      status: 'Under Review',
      progress: 75,
      submittedDate: '2024-01-15',
      deadline: '2024-03-01',
      documents: ['Transcript', 'SOP', 'LOR'],
      missingDocs: ['English Test']
    },
    {
      id: '2',
      program: 'Business Administration',
      university: 'Oxford University',
      country: 'United Kingdom',
      status: 'Accepted',
      progress: 100,
      submittedDate: '2024-01-10',
      deadline: '2024-02-15',
      documents: ['Transcript', 'SOP', 'LOR', 'IELTS'],
      missingDocs: []
    },
    {
      id: '3',
      program: 'Data Science',
      university: 'University of Toronto',
      country: 'Canada',
      status: 'Draft',
      progress: 30,
      submittedDate: null,
      deadline: '2024-04-01',
      documents: ['Transcript'],
      missingDocs: ['SOP', 'LOR', 'English Test']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Under Review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Draft':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Draft':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filterApplicationsByStatus = (status: string) => {
    if (status === 'all') return mockApplications;
    return mockApplications.filter(app => app.status.toLowerCase() === status);
  };

  if (loading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your university applications
          </p>
        </div>
        <Button 
          onClick={() => {
            if (!isComplete && shouldShowModal) {
              setShowProfileModal(true);
            } else {
              // Navigate to new application form
              console.log('Create new application');
            }
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{mockApplications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-2xl font-bold">
                  {filterApplicationsByStatus('under review').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">
                  {filterApplicationsByStatus('accepted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold">
                  {filterApplicationsByStatus('draft').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {mockApplications.map((application) => (
              <Card key={application.id} className="hover:shadow-soft transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{application.program}</CardTitle>
                      <CardDescription className="mt-1">
                        {application.university} • {application.country}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(application.status)}
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Application Progress</span>
                        <span className="font-medium">{application.progress}%</span>
                      </div>
                      <Progress value={application.progress} className="h-2" />
                    </div>

                    {/* Application Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Submitted</p>
                        <p className="font-semibold">
                          {application.submittedDate 
                            ? new Date(application.submittedDate).toLocaleDateString()
                            : 'Not submitted'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deadline</p>
                        <p className="font-semibold">
                          {new Date(application.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Documents</p>
                        <p className="font-semibold">
                          {application.documents.length}/{application.documents.length + application.missingDocs.length}
                        </p>
                      </div>
                    </div>

                    {/* Missing Documents */}
                    {application.missingDocs.length > 0 && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm font-medium text-orange-800 mb-1">
                          Missing Documents:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {application.missingDocs.map((doc) => (
                            <Badge key={doc} variant="outline" className="text-xs text-orange-700">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {application.status === 'Draft' && (
                        <Button size="sm">
                          Continue Application
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      {application.status === 'Accepted' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Offer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="space-y-4">
            {filterApplicationsByStatus('draft').map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{application.program}</h3>
                      <p className="text-sm text-muted-foreground">{application.university}</p>
                    </div>
                    <Button size="sm">Continue</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submitted">
          <div className="space-y-4">
            {filterApplicationsByStatus('under review').map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{application.program}</h3>
                      <p className="text-sm text-muted-foreground">{application.university}</p>
                    </div>
                    <Badge>{application.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="accepted">
          <div className="space-y-4">
            {filterApplicationsByStatus('accepted').map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{application.program}</h3>
                      <p className="text-sm text-muted-foreground">{application.university}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Offer Letter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <ProfileCompletionModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        completionPercentage={completionPercentage}
        action="apply"
      />
    </div>
  );
};

export default Applications;