import java.io.IOException;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.util.ToolRunner;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

import ex2.StatisticMapper;
import ex2.StatisticReducer;


//public class BillingJobs extends Configured implements Tool{
public class BillingJobs {
	/* public int run(String[] args) throws Exception {
		return 0;/*
         // Configuration processed by ToolRunner
         Configuration conf = getConf();
         
         // Create a JobConf using the processed conf
         JobConf job = new JobConf(conf, BillingJobs.class);
         
         // Process custom command-line options
         
         // Specify various job-specific parameters     
         job.setJobName("statistic-mapper");
         job.setInputFormat(TextInputFormat.class);
         job.setOutputFormat(TextOutputFormat.class);
         FileInputFormat.setInputPaths(job, new Path(args[0]));
         FileOutputFormat.setOutputPath(job, new Path(args[1]));
         
         job.setOutputKeyClass(Text.class);
         job.setOutputValueClass(IntWritable.class);
         
         job.setMapOutputKeyClass(Text.class);
         job.setMapOutputValueClass(IntWritable.class);
         

         // Submit the job, then poll for progress until the job is complete
         JobClient.runJob(job);
         return 0;
		 /*Configuration conf = new Configuration();
         Job job = Job.getInstance(conf, "billing");
         job.setJarByClass(BillingJobs.class);
         job.setMapperClass(StatisticMapper.class);
         job.setReducerClass(StatisticReducer.class);
         job.setOutputKeyClass(Text.class);
         job.setOutputValueClass(IntWritable.class);
         FileInputFormat.addInputPath(job, new Path(args[0]));
         FileOutputFormat.setOutputPath(job, new Path(args[1]));
		return 0;
       }*/
	 
	public static void main(String[] args) throws Exception{

		/* Qui vanno creati i tre job, uno per ogni esercizio obbligatorio
		 * Li avviamo uno dopo l'altro
		 */
	     /* int res = ToolRunner.run(new Configuration(), new BillingJobs(), args);
	      return ;*/
	      
		Job job = new Job(new Configuration(), "WordCount");
		job.setJarByClass(BillingJobs.class);
		job.setMapperClass(StatisticMapper.class);
		job.setReducerClass(StatisticReducer.class);
		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
		job.waitForCompletion(true);
	}
}
