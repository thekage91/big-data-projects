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

import ex2.*;


public class BillingJobs extends Configured implements Tool{
	//public class BillingJobs {
	public int run(String[] args) throws Exception {

		Configuration conf = getConf();
		Job job1 = Job.getInstance(conf, "Trimester Statistics 1 step");
		Job job2 = Job.getInstance(conf, "Trimester Statistics 2 step");
		
		job1.setJarByClass(BillingJobs.class);
		job1.setMapperClass(StatisticMapper.class);
		job1.setReducerClass(StatisticReducer.class);
		job1.setOutputKeyClass(Text.class);
		job1.setOutputValueClass(IntWritable.class);
		FileInputFormat.addInputPath(job1, new Path(args[0]));
		FileOutputFormat.setOutputPath(job1, new Path("temp"));
		job1.waitForCompletion(true);

		job2.setMapperClass(SecondStepMapper.class);
		job2.setReducerClass(SecondStepReducer.class);
		job2.setOutputKeyClass(Text.class);
		job2.setOutputValueClass(Text.class);
		FileInputFormat.addInputPath(job2, new Path("temp"));
		FileOutputFormat.setOutputPath(job2,new Path(args[1]));
		job2.waitForCompletion(true);
		return 0;
		
       }

		public static void main(String[] args) throws Exception{
		    int res = ToolRunner.run(new Configuration(), new BillingJobs(), args);
	        System.exit(res);
		}
	}
