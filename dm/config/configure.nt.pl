################################################################################
#
# $URL$
# $Revision$
# $Author$
#
# Description: LM configuration script.
#
# $Copyright-Start$
#
# Copyright (c) 2002-2007
# RedPrairie Corporation
# All Rights Reserved
#
# This software is furnished under a corporate license for use on a
# single computer system and can be copied (with inclusion of the
# above copyright) only for use on such a system.
#
# The information in this document is subject to change without notice
# and should not be construed as a commitment by RedPrairie Corporation.
#
# RedPrairie Corporation assumes no responsibility for the use of the
# software described in this document on equipment which has not been
# supplied or approved by RedPrairie Corporation.
#
# $Copyright-End$
#
################################################################################

require 5.000;

use Cwd;
use Env;
use File::Find;
use Getopt::Std;
use Win32::TieRegistry;


# ------------------------------------------------------------------------------
#
# FUNCTION: GetTaggedVersion
#
# PURPOSE:  Get the tagged version from the TaggedVersion file.
#
# ------------------------------------------------------------------------------

sub GetTaggedVersion
{
    my $taggedVersion;

    # Get the tagged version from the file.
    open(INFILE, "<TaggedVersion") or die "Could not open TaggedVersion: $!\n";
    $taggedVersion = <INFILE>;
    chomp $taggedVersion;
    close(INFILE);

    return $taggedVersion;
}


# ------------------------------------------------------------------------------
#
# FUNCTION: GetTaggedVersionClient
#
# PURPOSE:  Get the client tagged version for client by adding 000 to Major version 
# 			of server TaggedVersion file.
#
# ------------------------------------------------------------------------------

sub GetTaggedVersionClient
{
 
my $taggedVersion = GetTaggedVersion( );

(my $VB_MAJOR, $VB_MINOR, $tmprev) = (split /\./, $taggedVersion);
	
    return sprintf("%d000.%d.%s",$VB_MAJOR, $VB_MINOR, $tmprev);
}


# ------------------------------------------------------------------------------
#
# FUNCTION: FindInputFiles
#
# PURPOSE:  Find a list of configure input files by searching the given
#           pathname recursively looking for all files with a '.in' suffix.
#
# ------------------------------------------------------------------------------

sub FindInputFiles
{
    my ($directory) = @_;

    @inputFileList = ( );

    # Add this file to the file list if it's an input file.
    sub AddFile
    {
        if (/\.in$/)
        {
	    $File::Find::name =~ s/\//\\/g;
	    push @inputFileList, $File::Find::name;
        }
    }

    # Find every file under the given directory.
    find(\&AddFile, $directory);

    return @inputFileList;
}


# -------------------------------------------------------------------------
#
# FUNCTION: FindExecutable
#
# PURPOSE:  Find a list of configure input files by searching the given
#           pathname recursively looking for all files with a '.in' suffix.
#
# -------------------------------------------------------------------------

sub FindExecutable
{
    my ($executable) = @_;

    $found = ( );

    # Cycle through each directory in the search path.
    foreach $directory (split /;/, $ENV{PATH})
    {
        # Don't bother if this directory doesn't exist.
        if (! -d $directory)
        {
            next;
        }

        # Open the directory.
        opendir(DIR, $directory) or die "opendir: $!";

        # Cycle through each file in this directory.
        while (defined($filename = readdir(DIR)))
        {
            if ($filename eq $executable)
            {
                $found = $directory;
                closedir(DIR);
                break;
            }
        }

        # Close the directory.
        closedir(DIR);

        # If we've found a match, just break out.
        if ($found)
        {
            break;
        }
    }

    return $found;
}


# ------------------------------------------------------------------------------
#
# FUNCTION: AddOutputVariable
#
# PURPOSE:  Add the given output variable
#
# ------------------------------------------------------------------------------

sub AddOutputVariable
{
    my ($key, $value) = @_;

    # Add this key/value pair to the output variable list.
    $varlist{$key} = $value;
}


# ------------------------------------------------------------------------------
#
# FUNCTION: CreateOutputFiles
#
# PURPOSE:  Create output files by substituting output variables in each
#           of the input files.
#
# ------------------------------------------------------------------------------

sub CreateOutputFiles
{
    my @filelist = @_;

    my ($key, $filepair, $infile, $outfile);

    # Cycle through each pair of input and output files.
    foreach $filepair (@filelist)
    {
	# Determine the input and output files.
	($outfile, $infile) = (split /:/, $filepair);

	# Open the input and output files.
	open(INFILE,  "<$infile")  or die "Could not open $infile: $!\n";
	open(OUTFILE, ">$outfile") or die "Could not open $outfile: $!\n";

	# Display a message for the user.
	print "Creating $outfile\n";

	# Cycle through each line in the input file.
	while (<INFILE>)
	{
	    # Substitute output variables in this line.
	    foreach $key (sort keys %varlist)
	    {
	        $_ =~ s/\@$key\@/$varlist{$key}/g;
	    }
            print OUTFILE;
	}

	# Close the input and output files.
	close(INFILE);
	close(OUTFILE);
    }
}


# ------------------------------------------------------------------------------
#
# Start of Execution.
#
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# Handle command line options.
# ------------------------------------------------------------------------------

$Usage = "Usage: $0 [-r]\n";

getopts('r:') or exit(print $Usage);

$release = $opt_r if $opt_r;

# ------------------------------------------------------------------------------
# Set the release version.
# ------------------------------------------------------------------------------

print "Checking the release... ";

if ($release ne "Y")
{
    $RELEASE_VERSION    = qq("Build Date: " __DATE__);
    $DB_RELEASE_VERSION = "dev";
    $VB_RELEASE_VERSION = "dev";
    $VB_MAJOR           = "dev";
    $VB_MINOR           = "dev";
    $VB_REV             = "dev";
}
else
{
    $release_version    = GetTaggedVersion( );
    $RELEASE_VERSION    = qq("$release_version");
    $DB_RELEASE_VERSION = "$release_version";
    $VB_RELEASE_VERSION = "$release_version";


    # remove periods from string
    $VB_RELEASE_VERSION =~ s/\.//g;

    ($VB_MAJOR, $VB_MINOR, $tmprev) = (split /\./, $release_version);
    ($tmprev2, $tmprev3) = split(/a/, $tmprev);
    if ($tmprev3 eq "" )
    {
        #try 'b'
        ($tmprev2, $tmprev3) = split(/b/, $tmprev);
        if ($tmprev3 eq "")
        {
            #no letters , take as is
            $VB_REV = $tmprev;
        }
        else
        {
            $VB_REV = $tmprev2;
        }
    }
    else
    {
     	$VB_REV = $tmprev2;
    }
}

print "$DB_RELEASE_VERSION\n";

# ------------------------------------------------------------------------------
# Check for WinRunner runtime.
# ------------------------------------------------------------------------------

print "Checking the registry for WinRunner... ";

$key   = "HKEY_CLASSES_ROOT\\CLSID\\{DAB07E48-CC6F-11D0-8AE4-0080C8362177}\\InprocServer32";
$val = $Registry->{$key};
$value ="";

if ($val ne "" ) 
{
  $value = $val->GetValue('');
}

if (! $value)
{
    print "Not installed\n";
}
else
{
    print "$value\n";
}

# ------------------------------------------------------------------------------
# Set the dummy Perl path.
# ------------------------------------------------------------------------------

$PERL_PATH = "perl";

# ------------------------------------------------------------------------------
# Set the output variables.
# ------------------------------------------------------------------------------

AddOutputVariable(PERL_PATH,          $PERL_PATH);
AddOutputVariable(RELEASE_VERSION,    $RELEASE_VERSION);
AddOutputVariable(DB_RELEASE_VERSION, $DB_RELEASE_VERSION);
AddOutputVariable(VB_RELEASE_VERSION, $VB_RELEASE_VERSION);
AddOutputVariable(VB_MAJOR,           $VB_MAJOR);
AddOutputVariable(VB_MINOR,           $VB_MINOR);
AddOutputVariable(VB_REV,             $VB_REV);

# ------------------------------------------------------------------------------
# Build the output file argument list.  This involves just looking for files
# that end with a '.in' extension and adding it to the file list.
# ------------------------------------------------------------------------------

push @filelist, "InstallShield.h:InstallShield.h.in";

if ( -d "..\\makefiles" )
{
   push @filelist, "..\\makefiles\\Config.mk:Config.mk.win32-x86";
}

if ( -d "..\\db" )
{
    foreach $inputFile (FindInputFiles("..\\db\\data\\load"))
    {
        $outputFile = $inputFile;
        $outputFile =~ s/\.in$//;
        push @filelist, "$outputFile:$inputFile";
    }
}

if ( -d "..\\src" )
{
    foreach $inputFile (FindInputFiles("..\\src\\incsrc"))
    {
        $outputFile = $inputFile;
        $outputFile =~ s/\.in$//;
        push @filelist, "$outputFile:$inputFile";
    }
}

if ( -d "..\\scripts" )
{
    foreach $inputFile (FindInputFiles("..\\scripts"))
    {
        $outputFile = $inputFile;
        $outputFile =~ s/\.in$//;
        push @filelist, "$outputFile:$inputFile";
    }
}

if ( -d "..\\client" )
{
    # client configuration
    push @filelist, "..\\client\\makefiles\\client_config.mk:..\\client\\makefiles\\client_config.mk.in";
}

# ------------------------------------------------------------------------------
# Generate output files.
# ------------------------------------------------------------------------------

CreateOutputFiles(@filelist);

