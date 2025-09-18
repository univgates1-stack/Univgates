import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { FileUpload } from '@/components/FileUpload';
import { CalendarIcon, Upload, User, Mail, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { countries, countryCodes } from '@/data/countries';

const onboardingSchema = z.object({
  profilePicture: z.any().optional(),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }).refine((date) => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 16 && age <= 100;
  }, "Age must be between 16 and 100 years"),
  nationality: z.string().min(1, "Nationality is required"),
  hasDualNationality: z.boolean().default(false),
  secondNationality: z.string().optional(),
  nufusDocument: z.any().optional(),
  email: z.string().email("Invalid email address"),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  passportNumber: z.string().min(1, "Passport number is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
}).refine((data) => {
  if (data.hasDualNationality && !data.secondNationality) {
    return false;
  }
  return true;
}, {
  message: "Second nationality is required when dual nationality is selected",
  path: ["secondNationality"],
}).refine((data) => {
  if (data.secondNationality === 'TR' && !data.nufusDocument) {
    return false;
  }
  return true;
}, {
  message: "Nüfus Kayıt Örneği document is required for Turkish nationality",
  path: ["nufusDocument"],
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [nufusDocumentFile, setNufusDocumentFile] = useState<File | null>(null);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      hasDualNationality: false,
      countryCode: '+90',
    },
  });

  const watchHasDualNationality = form.watch('hasDualNationality');
  const watchSecondNationality = form.watch('secondNationality');

  useEffect(() => {
    const initializeForm = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Pre-fill email from auth user
      form.setValue('email', user.email || '');

      // Check if user is already onboarded
      const { data: studentData } = await supabase
        .from('students')
        .select('profile_completion_status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (studentData?.profile_completion_status === 'complete') {
        navigate('/dashboard');
      }
    };

    initializeForm();
  }, [navigate, form]);

  const onSubmit = async (data: OnboardingForm) => {
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

      let profilePictureUrl = null;

      // Upload profile picture if provided
      if (profilePictureFile) {
        const fileExt = profilePictureFile.name.split('.').pop();
        const fileName = `${user.id}_profile.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(fileName, profilePictureFile, { upsert: true });

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(fileName);
        
        profilePictureUrl = publicUrl;
      }

      // Update user profile with picture URL
      const userUpdates: any = {};
      if (profilePictureUrl) {
        userUpdates.profile_picture_url = profilePictureUrl;
      }

      if (Object.keys(userUpdates).length > 0) {
        const { error: userError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', user.id);

        if (userError) throw userError;
      }

      // Update student profile
      const { error: studentError } = await supabase
        .from('students')
        .update({
          date_of_birth: data.dateOfBirth.toISOString().split('T')[0],
          passport_number: data.passportNumber,
          country_of_origin: data.nationality,
          has_dual_citizenship: data.hasDualNationality,
          country_of_birth: data.secondNationality || null,
          profile_completion_status: 'partial',
        })
        .eq('user_id', user.id);

      if (studentError) throw studentError;

      // Get student ID for foreign key references
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!studentData) throw new Error('Student profile not found');

      // Insert or update student address
      const { error: addressError } = await supabase
        .from('student_addresses')
        .upsert({
          student_id: studentData.id,
          street: data.street,
          city: data.city,
          state: data.state,
          postal_code: data.postalCode,
          country: data.country,
        });

      if (addressError) throw addressError;

      // Insert or update student phone
      const { error: phoneError } = await supabase
        .from('student_phones')
        .upsert({
          student_id: studentData.id,
          phone_number: data.phoneNumber,
          country_code: data.countryCode,
          phone_type: 'mobile',
        });

      if (phoneError) throw phoneError;

      // Upload Turkish document if provided
      if (nufusDocumentFile && data.secondNationality === 'TR') {
        const { data: docTypes } = await supabase
          .from('document_types')
          .select('id')
          .eq('name', 'Nüfus Kayıt Örneği')
          .single();

        if (docTypes) {
          const fileExt = nufusDocumentFile.name.split('.').pop();
          const fileName = `${user.id}_nufus.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(fileName, nufusDocumentFile, { upsert: true });

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

          await supabase
            .from('documents')
            .insert({
              student_id: user.id,
              doc_type_id: docTypes.id,
              file_name: nufusDocumentFile.name,
              file_url: publicUrl,
              application_id: null,
            });
        }
      }

      toast({
        title: "Success",
        description: "Your personal information has been saved successfully!",
      });

      navigate('/academic-onboarding');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while saving your profile",
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
        // Keep profile as incomplete when skipping
        await supabase
          .from('students')
          .update({ profile_completion_status: 'incomplete' })
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error updating skip status:', error);
    }
    
    toast({
      title: "Reminder",
      description: "You can complete your profile later from the dashboard.",
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
              <p className="text-muted-foreground">Let's start with your basic details</p>
            </div>

            {/* Profile Picture */}
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  {profilePictureFile ? (
                    <AvatarImage src={URL.createObjectURL(profilePictureFile)} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <FileUpload
                  onFileSelect={setProfilePictureFile}
                  accept="image/*"
                  maxSize={5}
                  placeholder="Upload profile picture"
                  className="flex-1"
                />
              </div>
            </FormItem>

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Birth</FormLabel>
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
                            <span>Pick a date</span>
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
                          date > new Date() || date < new Date("1900-01-01")
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

            {/* Nationality */}
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nationality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your nationality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dual Nationality */}
            <FormField
              control={form.control}
              name="hasDualNationality"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Do you have another nationality?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Second Nationality */}
            {watchHasDualNationality && (
              <FormField
                control={form.control}
                name="secondNationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Second Nationality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your second nationality" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Turkish Document Upload */}
            {watchSecondNationality === 'TR' && (
              <FormItem>
                <FormLabel>Nüfus Kayıt Örneği</FormLabel>
                <FormDescription>
                  Please upload your Turkish population registry document
                </FormDescription>
                <FileUpload
                  onFileSelect={setNufusDocumentFile}
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={10}
                  placeholder="Upload Nüfus Kayıt Örneği"
                  showPreview={false}
                />
              </FormItem>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Mail className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
              <p className="text-muted-foreground">How can we reach you?</p>
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled />
                  </FormControl>
                  <FormDescription>
                    Your email address cannot be changed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Code</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countryCodes.map((code) => (
                          <SelectItem key={code.code} value={code.code}>
                            {code.flag} {code.code}
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="5xx xxx xx xx" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Passport Number */}
            <FormField
              control={form.control}
              name="passportNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passport Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your passport number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-2xl font-bold text-foreground">Address Information</h2>
              <p className="text-muted-foreground">Where do you currently live?</p>
            </div>

            {/* Street Address */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your street address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City and State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your state or province" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Postal Code and Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter postal code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Upload className="mx-auto h-12 w-12 text-primary mb-2" />
              <h2 className="text-2xl font-bold text-foreground">Review & Submit</h2>
              <p className="text-muted-foreground">Please review your information before submitting</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{form.watch('email')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium">{form.watch('countryCode')} {form.watch('phoneNumber')}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nationality:</span>
                  <p className="font-medium">
                    {countries.find(c => c.code === form.watch('nationality'))?.name}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <p className="font-medium">
                    {form.watch('dateOfBirth') ? format(form.watch('dateOfBirth'), 'PPP') : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Complete Your Profile
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}
              
              <div className="flex justify-between pt-6">
                <div className="flex space-x-2">
                  {currentStep > 1 && (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip for now
                  </Button>
                </div>
                
                <div>
                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isLoading}>
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
  );
};

export default Onboarding;