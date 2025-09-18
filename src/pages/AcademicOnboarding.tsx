import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { FileUpload } from '@/components/FileUpload';
import { CalendarIcon, Plus, Trash2, GraduationCap, Upload, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const examTypes = [
  'SAT',
  'TOEFL',
  'IELTS',
  'GRE',
  'GMAT',
  'ACT',
  'YDS',
  'YÖKDİL',
  'Other'
];

const documentTypes = [
  { id: 'passport_photo', name: 'Passport Photo', required: true },
  { id: 'transcript', name: 'Academic Transcript', required: true },
  { id: 'diploma', name: 'Diploma/Certificate', required: true },
  { id: 'degree_grade', name: 'Degree Grade Certificate', required: false },
  { id: 'other', name: 'Additional Documents', required: false }
];

const academicSchema = z.object({
  graduatedSchoolName: z.string().min(1, "School name is required"),
  graduationDate: z.date({
    required_error: "Graduation date is required",
  }),
  graduationGrade: z.string().min(1, "Graduation grade is required"),
  exams: z.array(z.object({
    examName: z.string().min(1, "Exam name is required"),
    score: z.string().min(1, "Score is required"),
    examDate: z.date({
      required_error: "Exam date is required",
    }),
    document: z.any().optional(),
  })).optional().default([]),
  documents: z.object({
    passport_photo: z.any().optional(),
    transcript: z.any().optional(),
    diploma: z.any().optional(),
    degree_grade: z.any().optional(),
    other: z.array(z.any()).optional().default([]),
  }),
});

type AcademicForm = z.infer<typeof academicSchema>;

const AcademicOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<{[key: string]: File | null}>({});
  const [additionalDocuments, setAdditionalDocuments] = useState<File[]>([]);
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const form = useForm<AcademicForm>({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      exams: [],
      documents: {
        other: [],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exams"
  });

  useEffect(() => {
    // Check if user completed basic onboarding
    const checkBasicOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: studentData } = await supabase
        .from('students')
        .select('date_of_birth, passport_number, country_of_origin')
        .eq('user_id', user.id)
        .maybeSingle();

      // Check if basic onboarding is complete
      if (!studentData?.date_of_birth || !studentData?.passport_number || !studentData?.country_of_origin) {
        navigate('/onboarding');
        return;
      }
    };

    checkBasicOnboarding();
  }, [navigate]);

  const onSubmit = async (data: AcademicForm) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to complete onboarding",
          variant: "destructive",
        });
        return;
      }

      // Update student academic information
      const { error: studentError } = await supabase
        .from('students')
        .update({
          graduated_school_name: data.graduatedSchoolName,
          graduation_date: data.graduationDate.toISOString().split('T')[0],
          degree_grade: parseFloat(data.graduationGrade) || null,
          profile_completion_status: 'complete',
        })
        .eq('user_id', user.id);

      if (studentError) throw studentError;

      // Insert exam results with file uploads
      if (data.exams && data.exams.length > 0) {
        for (let i = 0; i < data.exams.length; i++) {
          const exam = data.exams[i];
          let fileUrl = null;

          // Upload exam document if provided
          const examFile = documentFiles[`exam_${i}`];
          if (examFile) {
            const fileExt = examFile.name.split('.').pop();
            const fileName = `${user.id}_exam_${i}.${fileExt}`;
            
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('documents')
              .upload(fileName, examFile, { upsert: true });

            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage
              .from('documents')
              .getPublicUrl(fileName);
            
            fileUrl = publicUrl;
          }

          await supabase
            .from('student_exam_documents')
            .insert({
              student_id: user.id,
              exam_name: exam.examName,
              exam_score: exam.score,
              exam_date: exam.examDate.toISOString().split('T')[0],
              file_url: fileUrl,
            });
        }
      }

      // Get document type IDs
      const { data: docTypesData } = await supabase
        .from('document_types')
        .select('id, name');

      const docTypeMap = docTypesData?.reduce((acc: any, dt: any) => {
        acc[dt.name.toLowerCase().replace(/\s+/g, '_')] = dt.id;
        return acc;
      }, {}) || {};

      // Upload required documents
      const documentUploads = [
        { key: 'passport_photo', name: 'Passport Photo' },
        { key: 'transcript', name: 'Academic Transcript' },
        { key: 'diploma', name: 'Diploma/Certificate' },
        { key: 'degree_grade', name: 'Degree Grade Certificate' }
      ];

      for (const doc of documentUploads) {
        const file = documentFiles[doc.key];
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}_${doc.key}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, file, { upsert: true });

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

          const docTypeId = docTypeMap[doc.key] || null;
          if (docTypeId) {
            await supabase
              .from('documents')
              .insert({
                student_id: user.id,
                doc_type_id: docTypeId,
                file_name: file.name,
                file_url: publicUrl,
                application_id: null,
              });
          }
        }
      }

      // Upload additional documents
      for (let i = 0; i < additionalDocuments.length; i++) {
        const file = additionalDocuments[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}_additional_${i}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(fileName);

        const otherDocTypeId = docTypeMap['other'] || null;
        if (otherDocTypeId) {
          await supabase
            .from('documents')
            .insert({
              student_id: user.id,
              doc_type_id: otherDocTypeId,
              file_name: file.name,
              file_url: publicUrl,
              application_id: null,
            });
        }
      }

      toast({
        title: "Success",
        description: "Your academic information has been saved successfully!",
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving your academic information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Keep profile as partial when skipping academic info
        await supabase
          .from('students')
          .update({ profile_completion_status: 'partial' })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating skip status:', error);
    }
    
    toast({
      title: "Reminder",
      description: "Please complete your academic information later for better application processing.",
    });
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addExam = () => {
    append({
      examName: '',
      score: '',
      examDate: new Date(),
      document: null,
    });
  };

  const handleDocumentUpload = (type: string, file: File | null) => {
    setDocumentFiles(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleAdditionalDocument = (files: File[]) => {
    setAdditionalDocuments(prev => [...prev, ...files]);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <GraduationCap className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-2xl font-bold text-foreground">Academic Background</h2>
              <p className="text-muted-foreground">Tell us about your educational history</p>
            </div>

            {/* School Name */}
            <FormField
              control={form.control}
              name="graduatedSchoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Graduated School/University</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter the name of your graduated institution" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Graduation Date */}
            <FormField
              control={form.control}
              name="graduationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Graduation Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select graduation date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1950-01-01")
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Graduation Grade */}
            <FormField
              control={form.control}
              name="graduationGrade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduation Grade / GPA</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., 3.75, 85/100, First Class Honours" />
                  </FormControl>
                  <FormDescription>
                    Enter your grade in the format used by your institution
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <BookOpen className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-2xl font-bold text-foreground">Exam Results</h2>
              <p className="text-muted-foreground">Add your standardized test scores (optional)</p>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-foreground">Exam {index + 1}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`exams.${index}.examName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Type</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select exam type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {examTypes.map((exam) => (
                                <SelectItem key={exam} value={exam}>
                                  {exam}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exams.${index}.score`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Score</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your score" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`exams.${index}.examDate`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Exam Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select exam date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("2000-01-01")
                                }
                                initialFocus
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormItem>
                      <FormLabel>Score Report (Optional)</FormLabel>
                      <FileUpload
                        onFileSelect={(file) => handleDocumentUpload(`exam_${index}`, file)}
                        accept=".pdf,.jpg,.jpeg,.png"
                        maxSize={10}
                        placeholder="Upload score report"
                        showPreview={false}
                      />
                    </FormItem>
                  </div>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addExam}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Exam
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-2xl font-bold text-foreground">Upload Documents</h2>
              <p className="text-muted-foreground">Please upload your academic documents</p>
            </div>

            <div className="space-y-6">
              {documentTypes.map((docType) => (
                <Card key={docType.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-foreground">
                        {docType.name}
                        {docType.required && <span className="text-destructive ml-1">*</span>}
                      </h3>
                    </div>
                    
                    {docType.id === 'other' ? (
                      <div className="space-y-2">
                        <FileUpload
                          onFileSelect={(file) => file && handleAdditionalDocument([file])}
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          maxSize={10}
                          placeholder="Upload additional documents"
                          showPreview={false}
                        />
                        {additionalDocuments.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            {additionalDocuments.length} additional document(s) uploaded
                          </div>
                        )}
                      </div>
                    ) : (
                      <FileUpload
                        onFileSelect={(file) => handleDocumentUpload(docType.id, file)}
                        accept={docType.id === 'passport_photo' ? 'image/*' : '.pdf,.jpg,.jpeg,.png'}
                        maxSize={10}
                        placeholder={`Upload ${docType.name.toLowerCase()}`}
                        showPreview={docType.id === 'passport_photo'}
                      />
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">File Requirements:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Maximum file size: 10MB</li>
                <li>• Accepted formats: PDF, JPG, PNG, DOC, DOCX</li>
                <li>• Passport photo should be in image format</li>
                <li>• All documents should be clear and readable</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Academic Information</span>
            <span>{currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-foreground">
              Complete Your Academic Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStep()}

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    className="flex-1"
                  >
                    Skip for now
                  </Button>
                  
                  <div className="flex gap-2 flex-1">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex-1"
                      >
                        Previous
                      </Button>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex-1"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {isLoading ? "Saving..." : "Complete Profile"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcademicOnboarding;