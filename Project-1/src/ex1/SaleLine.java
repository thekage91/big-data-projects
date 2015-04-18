package ex1;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Set;

import javax.lang.model.SourceVersion;
import javax.tools.Tool;

import org.apache.hadoop.conf.Configured;

class SaleLine {
	
	public String name;
	public Integer count;

	public SaleLine(String name, Integer count) {
		this.name = name;
		this.count = count;
	}
}
	

