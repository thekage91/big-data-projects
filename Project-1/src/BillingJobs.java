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
import org.apache.hadoop.mapreduce.tools.CLI;
import org.apache.hadoop.mapred.JobClient;

import ex2.StatisticMapper;
import ex2.StatisticReducer;


public class BillingJobs extends Configured implements Tool{
	//public class BillingJobs {
	public int run(String[] args) throws Exception {

		Configuration conf = getConf();
		Job job = Job.getInstance(conf, "Trimester Statistics");
		JobClient c = new JobClient();
		job.setJarByClass(BillingJobs.class);
		job.setMapperClass(StatisticMapper.class);
		job.setReducerClass(StatisticReducer.class);
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));
		// Submit the job, then poll for progress until the job is complete
		job.waitForCompletion(true);
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
		return 0;*/
       }

		public static void main(String[] args) throws Exception{
		    int res = ToolRunner.run(new Configuration(), new BillingJobs(), args);
	         
	         System.exit(res);

			/*Job job = new Job(new Configuration(), "WordCount");
		job.setJarByClass(BillingJobs.class);
		job.setMapperClass(StatisticMapper.class);
		job.setReducerClass(StatisticReducer.class);
		FileInputFormat.addInputPath(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));
		job.setOutputKeyClass(Text.class);
		job.setOutputValueClass(IntWritable.class);
		job.waitForCompletion(true);*/


		}
	}
